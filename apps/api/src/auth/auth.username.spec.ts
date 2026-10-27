jest.mock('../../drizzle', () => ({
  __esModule: true,
  default: { select: jest.fn(), update: jest.fn(), insert: jest.fn() },
}));
jest.mock('../../lib/supabase', () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        listUsers: jest.fn().mockResolvedValue({ data: { users: [] } }),
      },
    },
  },
}));
jest.mock('src/activity/activity.service', () => ({
  ActivityService: class {},
}));
jest.mock('src/wallet/wallet.service', () => ({ WalletService: class {} }));
jest.mock('src/rewards/rewards.service', () => ({ RewardsService: class {} }));
jest.mock('../cron-tasks/cron-tasks.service', () => ({
  CronTasksService: class {},
}));
jest.mock('src/resend/resend.service', () => ({ ResendService: class {} }));
jest.mock('src/roadmap/roadmap.service', () => ({ RoadmapService: class {} }));
jest.mock('src/community/community.service', () => ({
  CommunityService: class {},
}));
jest.mock('src/social/social.service', () => ({ SocialService: class {} }));
jest.mock('src/leaderboard/leaderboard.service', () => ({
  LeaderboardService: class {},
}));
jest.mock('src/common/cloudinary/cloudinary.service', () => ({
  CloudinaryService: class {},
}));
jest.mock('src/reminders/reminders.service', () => ({
  RemindersService: class {},
}));

import { BadRequestException, ConflictException } from '@nestjs/common';
import db from '../../drizzle';
import { User } from '../../lib/db/schema';
import { AuthService } from './auth.service';
import { validateUsername } from './username';

const mockDb = db as unknown as {
  select: jest.Mock;
  update: jest.Mock;
  insert: jest.Mock;
};

describe('AuthService username ownership', () => {
  let service: AuthService;
  let returning: jest.Mock;
  let set: jest.Mock;
  const currentUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'ada@example.com',
    username: 'ada',
    profilePictureURL: 'https://images.example/avatar.png',
    quizLimits: 5,
  } as User;

  function selectRows(rows: unknown[]) {
    mockDb.select.mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest
          .fn()
          .mockReturnValue({ limit: jest.fn().mockResolvedValue(rows) }),
      }),
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    service = Object.create(AuthService.prototype) as AuthService;
    jest.spyOn(service, 'getUserById').mockResolvedValue(currentUser);
    jest
      .spyOn(service, 'getUserByEmail')
      .mockResolvedValue(currentUser as never);
    returning = jest
      .fn()
      .mockResolvedValue([
        { ...currentUser, username: 'ada_new', hasCompletedProfile: true },
      ]);
    set = jest
      .fn()
      .mockReturnValue({ where: jest.fn().mockReturnValue({ returning }) });
    mockDb.update.mockReturnValue({ set });
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => jest.restoreAllMocks());

  it('completes a profile with an EduLearn-only handle and preserves its avatar', async () => {
    selectRows([]);
    const result = await service.updateUsername(currentUser.id, 'ada_new');
    expect(set).toHaveBeenCalledWith({
      username: 'ada_new',
      hasCompletedProfile: true,
    });
    expect(mockDb.update).toHaveBeenCalledTimes(1);
    expect(result?.profilePictureURL).toBe(currentUser.profilePictureURL);
    expect(result?.username).toBe('ada_new');
  });

  it('lets a user submit their own unchanged legacy handle', async () => {
    const legacyUser = { ...currentUser, username: 'Legacy.Handle' };
    jest.spyOn(service, 'getUserById').mockResolvedValue(legacyUser);
    returning.mockResolvedValue([legacyUser]);
    await expect(
      service.updateUsername(currentUser.id, legacyUser.username),
    ).resolves.toMatchObject({ username: legacyUser.username });
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('rejects an occupied handle before writing', async () => {
    selectRows([{ id: 'another-user' }]);
    await expect(
      service.updateUsername(currentUser.id, 'taken'),
    ).rejects.toThrow(ConflictException);
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it('handles a handle claimed after the availability check', async () => {
    selectRows([]);
    returning.mockRejectedValue({
      cause: { code: '23505', constraint_name: 'user_username_idx' },
    });
    await expect(
      service.updateUsername(currentUser.id, 'ada_new'),
    ).rejects.toThrow(ConflictException);
  });

  it.each(['update', 'edit', 'signup', 'oauth'])(
    'validates %s on the server before writing',
    async (path) => {
      const work =
        path === 'update'
          ? service.updateUsername(currentUser.id, '@invalid')
          : path === 'edit'
            ? service.editUser({
                email: currentUser.email,
                name: 'Ada',
                username: '@invalid',
                learning: '',
              })
            : path === 'signup'
              ? service.createUser({
                  id: currentUser.id,
                  name: 'Ada',
                  email: currentUser.email,
                  username: '@invalid',
                })
              : service.createOAuthUser({
                  id: currentUser.id,
                  name: 'Ada',
                  email: currentUser.email,
                  username: '@invalid',
                });
      await expect(work).rejects.toThrow(BadRequestException);
      expect(mockDb.update).not.toHaveBeenCalled();
      expect(mockDb.insert).not.toHaveBeenCalled();
    },
  );

  it('does not treat an existing mixed-case handle as available', async () => {
    selectRows([{ email: 'someone@example.com', username: 'Ada' }]);
    await expect(
      service.checkUserAvailability(undefined, 'ada'),
    ).resolves.toMatchObject({ usernameAvailable: false });
  });

  it('rejects duplicate username writes from the edit path', async () => {
    selectRows([]);
    returning.mockRejectedValue({
      code: '23505',
      constraint_name: 'user_username_unique',
    });
    await expect(
      service.editUser({
        email: currentUser.email,
        name: 'Ada',
        username: 'ada_new',
        learning: '',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('keeps generated OAuth handles within the same username rules', async () => {
    jest.spyOn(service, 'getUserByEmailOrProviderId').mockResolvedValue(null);
    const create = jest
      .spyOn(service, 'createOAuthUser')
      .mockResolvedValue(currentUser);
    await service.handleOAuthUser({
      id: currentUser.id,
      email: `${'a'.repeat(64)}@example.com`,
      name: 'Ada',
      provider: 'google',
      providerId: 'google-id',
    });
    const username = create.mock.calls[0][0].username;
    expect(username.length).toBeLessThanOrEqual(30);
    expect(() => validateUsername(username)).not.toThrow();
  });
});
