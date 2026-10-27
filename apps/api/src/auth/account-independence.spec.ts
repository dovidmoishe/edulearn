jest.mock('../../drizzle', () => ({
  __esModule: true,
  default: {
    select: jest.fn(),
    update: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('src/auth/auth.service', () => ({ AuthService: class {} }));
jest.mock('src/resend/resend.service', () => ({ ResendService: class {} }));
jest.mock('src/social/social.service', () => ({ SocialService: class {} }));
jest.mock('src/leaderboard/leaderboard.service', () => ({
  LeaderboardService: class {},
}));
jest.mock('src/subscription/subscription.service', () => ({
  SubscriptionService: class {},
}));
jest.mock('src/common/services/expo-push.service', () => ({
  ExpoPushService: class {},
}));
jest.mock('src/common/services/notifications.service', () => ({
  NotificationsService: class {},
}));
jest.mock('src/cards/cards.service', () => ({ CardsService: class {} }));
jest.mock('lib/crypto.util', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));
jest.mock('../../lib/transaction/transactionSender', () => ({
  transactionSenderAndConfirmationWaiter: jest.fn(),
}));
jest.mock('@solana/web3.js', () => ({
  PublicKey: class {
    constructor(public value: string) {}
  },
}));
jest.mock('@solana/spl-token', () => ({}));
jest.mock('@project-serum/anchor', () => ({}));
jest.mock('@metaplex-foundation/umi-bundle-defaults', () => ({}));
jest.mock('@metaplex-foundation/mpl-core', () => ({}));
jest.mock('@metaplex-foundation/umi', () => ({}));
jest.mock('paj_ramp', () => ({}));

import db from '../../drizzle';
import { WalletService } from '../wallet/wallet.service';
import { RewardsService } from '../rewards/rewards.service';
import { CronTasksService } from '../cron-tasks/cron-tasks.service';
import { MonthlyLeaderboardService } from '../monthly-leaderboard/monthly-leaderboard.service';

describe('EduLearn actions without an external social account', () => {
  const learner = {
    id: 'learner',
    name: 'Ada',
    username: 'ada',
    email: 'ada@example.com',
    address: 'test-wallet',
    totalEarnings: '5.00',
  };
  let sendEmail: jest.Mock;
  let notifyFollowers: jest.Mock;
  let sendPushNotification: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    sendEmail = jest.fn().mockResolvedValue(undefined);
    notifyFollowers = jest.fn().mockResolvedValue(undefined);
    sendPushNotification = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  function wallet() {
    const service = Object.create(WalletService.prototype) as WalletService;
    Object.assign(service, {
      authService: { getUserById: jest.fn().mockResolvedValue(learner) },
      resendService: { sendEmail },
      socialService: { notifyFollowers },
    });
    const transferUSDC = jest.fn().mockResolvedValue('local-test-tx');
    Object.assign(service, {
      getEarningsClaimEmailTemplate: jest
        .fn()
        .mockReturnValue('<p>Claimed</p>'),
      transferUSDC,
    });
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest
          .fn()
          .mockResolvedValue([{ userId: learner.id, sol: '5', edln: '0' }]),
      }),
    });
    return { service, transferUSDC };
  }

  it('returns a successful claim after the transfer, email, and follower notification', async () => {
    const { service, transferUSDC } = wallet();
    await expect(
      service.claimEarnings(learner.id, 'sol'),
    ).resolves.toMatchObject({
      success: true,
      transactions: [{ type: 'usdc', tx: 'local-test-tx' }],
    });
    expect(transferUSDC).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      learner.email,
      expect.any(String),
      '<p>Claimed</p>',
    );
    expect(notifyFollowers).toHaveBeenCalledWith(learner.id, {
      type: 'earnings_claimed',
      data: { amount: 5 },
    });
  });

  it('still restores earnings when the transfer fails', async () => {
    const { service, transferUSDC } = wallet();
    transferUSDC.mockRejectedValue(new Error('Transfer failed'));
    const values = jest.fn().mockResolvedValue(undefined);
    (db.insert as jest.Mock).mockReturnValue({ values });
    await expect(service.claimEarnings(learner.id, 'sol')).rejects.toThrow(
      'Transfer failed',
    );
    expect(values).toHaveBeenCalledWith({
      userId: learner.id,
      sol: '5',
      edln: '0',
    });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(notifyFollowers).not.toHaveBeenCalled();
  });

  it('awards a reward and notifies the learner and followers', async () => {
    const service = Object.create(RewardsService.prototype) as RewardsService;
    const sendNFTAwardEmail = jest.fn().mockResolvedValue(undefined);
    Object.assign(service, {
      resendService: { sendNFTAwardEmail },
      socialService: { notifyFollowers },
    });
    const reward = {
      id: 'reward',
      title: 'First steps',
      description: 'Keep learning',
      imageUrl: 'https://images.example/badge.png',
    };
    for (const rows of [[learner], [reward], []]) {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest
          .fn()
          .mockReturnValue({ where: jest.fn().mockResolvedValue(rows) }),
      });
    }
    const awarded = { id: 'award', userId: learner.id, rewardId: reward.id };
    (db.insert as jest.Mock).mockReturnValue({
      values: jest
        .fn()
        .mockReturnValue({ returning: jest.fn().mockResolvedValue([awarded]) }),
    });
    await expect(
      service.awardRewardToUser(learner.id, reward.id),
    ).resolves.toEqual(awarded);
    expect(sendNFTAwardEmail).toHaveBeenCalledWith(
      learner.email,
      learner.name,
      reward.title,
      reward.description,
      reward.imageUrl,
    );
    expect(notifyFollowers).toHaveBeenCalledWith(
      learner.id,
      expect.objectContaining({ type: 'nft_earned' }),
    );
  });

  function cron() {
    const service = Object.create(
      CronTasksService.prototype,
    ) as CronTasksService;
    Object.assign(service, {
      logger: { log: jest.fn(), error: jest.fn() },
      expoPushService: { sendPushNotification },
    });
    return service;
  }

  it('keeps daily leaderboard push notifications', async () => {
    const service = cron();
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          limit: jest
            .fn()
            .mockResolvedValue([{ ...learner, expoPushToken: 'push-token' }]),
        }),
      }),
    });
    await service.notifyDailyLeaderboardLeaders();
    expect(sendPushNotification).toHaveBeenCalledWith(
      'push-token',
      expect.any(String),
      expect.any(String),
      { screen: 'leaderboard' },
    );
  });

  it('still grants the three weekly premium prizes and notifies each winner', async () => {
    jest.useFakeTimers({ now: new Date('2026-10-26T12:00:00Z') });
    const service = cron();
    const winners = [1, 2, 3].map((rank) => ({
      userId: `winner-${rank}`,
      user: { expoPushToken: `push-${rank}` },
    }));
    Object.assign(service, {
      leaderboardService: {
        finalizeWeeklyLeaderboard: jest.fn().mockResolvedValue(winners),
      },
    });
    const set = jest
      .fn()
      .mockReturnValue({ where: jest.fn().mockResolvedValue(undefined) });
    (db.update as jest.Mock).mockReturnValue({ set });
    await service.finalizeWeeklyLeaderboard();
    expect(set).toHaveBeenCalledTimes(3);
    expect(sendPushNotification).toHaveBeenCalledTimes(3);
    for (const [index, days] of [7, 3, 1].entries()) {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + days);
      expect(set).toHaveBeenNthCalledWith(index + 1, {
        isPremium: true,
        premiumUntil,
      });
      expect(sendPushNotification).toHaveBeenNthCalledWith(
        index + 1,
        `push-${index + 1}`,
        expect.any(String),
        `You won ${days} days premium!`,
        { screen: 'leaderboard' },
      );
    }
  });

  it('keeps monthly leaderboard image previews usable', async () => {
    const png = Buffer.from('local-test-png');
    const generateMonthlyLeaderboardCard = jest.fn().mockResolvedValue(png);
    const getMonthlyXpLeaders = jest.fn().mockResolvedValue([
      {
        rank: 1,
        totalXp: 250,
        user: { ...learner, profilePictureURL: null },
      },
    ]);
    const service = new MonthlyLeaderboardService(
      { generateMonthlyLeaderboardCard } as never,
      { getMonthlyXpLeaders } as never,
    );
    await expect(
      service.buildPreviewPng({ year: 2026, month: 10 }),
    ).resolves.toBe(png);
    expect(generateMonthlyLeaderboardCard).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: [expect.objectContaining({ username: 'ada', xp: 250 })],
      }),
    );
  });
});
