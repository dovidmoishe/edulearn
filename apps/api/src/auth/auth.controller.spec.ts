jest.mock('./auth.service', () => ({
  AuthService: class AuthService {},
}));
jest.mock('../../drizzle', () => ({ __esModule: true, default: {} }));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('prevents a signed-in user from editing another account username', async () => {
    await expect(
      controller.editUser(
        { user: { email: 'ada@example.com' } },
        {
          email: 'other@example.com',
          name: 'Other',
          username: 'other',
          learning: '',
        },
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
