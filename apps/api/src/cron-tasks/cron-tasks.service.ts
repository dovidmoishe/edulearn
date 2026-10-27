import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { AuthService } from '../auth/auth.service';
import { WalletService } from 'src/wallet/wallet.service';
import db from '../../drizzle';
import { desc, and, eq, lt } from 'drizzle-orm';
import { roadmap, roadMapStep, user } from '../../lib/db/schema';
import { ExpoPushService } from 'src/common/services/expo-push.service';
import { NotificationsService } from 'src/common/services/notifications.service';
import { ResendService } from 'src/resend/resend.service';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name);
  constructor(
    @Inject(
      forwardRef(() => {
        /* eslint-disable @typescript-eslint/no-require-imports -- defer AuthService to break circular import */
        const mod =
          require('../auth/auth.service') as typeof import('../auth/auth.service');
        /* eslint-enable @typescript-eslint/no-require-imports */
        return mod.AuthService;
      }),
    )
    private authService: AuthService,
    private walletService: WalletService,
    private expoPushService: ExpoPushService,
    private notificationsService: NotificationsService,
    private resendService: ResendService,
    private leaderboardService: LeaderboardService,
    @Inject(forwardRef(() => SubscriptionService))
    private subscriptionService: SubscriptionService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async notifyDailyLeaderboardLeaders() {
    const topUsers = await db
      .select()
      .from(user)
      .orderBy(desc(user.xp))
      .limit(3);

    if (topUsers.length === 0) {
      this.logger.log('Daily leaderboard: no users, skipping');
      return;
    }

    for (const u of topUsers) {
      if (u.expoPushToken) {
        await this.expoPushService.sendPushNotification(
          u.expoPushToken,
          'EduLearn Top Users 🏆',
          "You are in the top 3 users today, let's keep it up!",
          {
            screen: 'leaderboard',
          },
        );
      }
    }
  }

  @Cron('0 20 * * *')
  async checkStreakExpirations() {
    this.logger.log('Checking for expiring streaks');
    try {
      const now = new Date();
      const todayMidnight = new Date(now);
      todayMidnight.setHours(0, 0, 0, 0);
      const allUsers = await db.select().from(user);
      for (const currentUser of allUsers) {
        if (!currentUser.lastLoggedIn) continue;
        const lastLoginMidnight = new Date(currentUser.lastLoggedIn);
        lastLoginMidnight.setHours(0, 0, 0, 0);
        const daysSinceLogin = Math.floor(
          (todayMidnight.getTime() - lastLoginMidnight.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (
          daysSinceLogin >= 1 &&
          (currentUser.streak || 0) >= 3 &&
          currentUser.expoPushToken
        ) {
          const hoursRemaining = 24 - now.getHours();
          await this.expoPushService.sendPushNotification(
            currentUser.expoPushToken,
            '🔥 Streak Expiring Soon!',
            `Your ${currentUser.streak}-day streak expires in ${hoursRemaining} hours! Check in now to keep it alive.`,
            { screen: 'profile', action: 'streak_warning' },
          );
          this.logger.log(
            `Sent streak warning to user ${currentUser.id} (${currentUser.streak} days)`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Failed to check streak expirations', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCreditRenewal() {
    this.logger.log('Running daily credit renewal');
    try {
      const allUsers = await db.select().from(user);

      for (const user of allUsers) {
        await this.authService.renewUserCredits(user.id);
      }

      this.logger.log('Credit renewal completed');
    } catch (error) {
      this.logger.error('Failed to process credit renewals', error);
    }
  }

  // @Cron('0 0 1 * *')
  // async rewardTopUsersMonthly() {
  //   this.logger.log('Starting monthly top user rewards job');

  //   try {
  //     const today = new Date();
  //     if (today.getDate() !== 1) {
  //       this.logger.log('Not the 1st day of the month, skipping rewards');
  //       return;
  //     }

  //     const topUsers = await db.select()
  //       .from(user)
  //       .orderBy(desc(user.xp))
  //       .limit(3);

  //     this.logger.log(`Found ${topUsers.length} top users to reward`);

  //     for (let i = 0; i < topUsers.length; i++) {
  //       const currentUser = topUsers[i];

  //       const earning = 3
  //       try {
  //         await this.walletService.addEarnings(currentUser.id, {
  //           sol: earning,
  //           edln: 0
  //         });

  //         if(currentUser.expoPushToken) {
  //           await this.expoPushService.sendPushNotification(currentUser.expoPushToken as string, "Monthly Top User Rewards", "You have been awarded rewards for being in the top 3 users this month. Check the rewards tab on the web app to see your rewards.");
  //         }
  //         this.logger.log(`Successfully awarded rewards to user ${currentUser.id}`);
  //       } catch (error) {
  //         this.logger.error(`Failed to award rewards to user ${currentUser.id}`, error);
  //       }
  //     }

  //     this.logger.log('Monthly top user rewards completed');
  //   } catch (error) {
  //     this.logger.error('Failed to process monthly top user rewards', error);
  //   }
  // }

  @Cron('0 0 * * *')
  async handlePremiumExpiration() {
    this.logger.log('Checking for expired premium subscriptions');
    try {
      const now = new Date();
      const expiredUsers = await db
        .select()
        .from(user)
        .where(and(eq(user.isPremium, true), lt(user.premiumUntil, now)));

      this.logger.log(
        `Found ${expiredUsers.length} users with expired premium subscriptions`,
      );

      for (const expiredUser of expiredUsers) {
        try {
          await this.authService.updateUserPremiumStatus(expiredUser.id, false);
          this.logger.log(
            `Reset premium status for user ${expiredUser.id} (${expiredUser.email})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to reset premium status for user ${expiredUser.id}`,
            error,
          );
        }
      }

      this.logger.log(
        `Premium expiration check completed - processed ${expiredUsers.length} expired subscriptions`,
      );
    } catch (error) {
      this.logger.error('Failed to process premium expirations', error);
    }
  }

  @Cron('0 0 * * *')
  async handleUserSubscriptionExpiration() {
    this.logger.log('Checking for expired user subscriptions');
    try {
      const { expiredCount } =
        await this.subscriptionService.expireUserSubscriptions();
      this.logger.log(
        `User subscription expiration check completed — deactivated ${expiredCount} row(s)`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to process user subscription expirations',
        error,
      );
    }
  }

  @Cron('0 0 * * 0')
  async finalizeWeeklyLeaderboard() {
    this.logger.log('Finalizing weekly leaderboard');
    try {
      const topUsers =
        await this.leaderboardService.finalizeWeeklyLeaderboard();
      const prizes = [
        { rank: 1, premiumDays: 7 },
        { rank: 2, premiumDays: 3 },
        { rank: 3, premiumDays: 1 },
      ];
      for (let i = 0; i < topUsers.length; i++) {
        const u = topUsers[i];
        const prize = prizes[i];
        try {
          const premiumUntil = new Date();
          premiumUntil.setDate(premiumUntil.getDate() + prize.premiumDays);
          await db
            .update(user)
            .set({
              isPremium: true,
              premiumUntil,
            })
            .where(eq(user.id, u.userId));
          if (u.user.expoPushToken) {
            await this.expoPushService.sendPushNotification(
              u.user.expoPushToken,
              `🏆 Weekly Leaderboard Rank #${i + 1}!`,
              `You won ${prize.premiumDays} days premium!`,
              { screen: 'leaderboard' },
            );
          }
        } catch (err) {
          this.logger.error(`Failed to award prize to user ${u.userId}`, err);
        }
      }
    } catch (error) {
      this.logger.error('Failed to finalize weekly leaderboard', error);
    }
  }

  // Legacy broadcast-ish reminder loop. Replaced by per-user autonomous reminders (BullMQ).
  // Intentionally NOT scheduled.
  async remindUsersAboutRoadmaps() {
    const incompleteSteps = await db
      .select()
      .from(roadMapStep)
      .where(eq(roadMapStep.done, false));

    const userRoadmapMap = new Map<
      string,
      Array<{ roadmapId: string; step: typeof roadMapStep.$inferSelect }>
    >();

    for (const step of incompleteSteps) {
      const roadmapData = await db
        .select()
        .from(roadmap)
        .where(eq(roadmap.id, step.roadmapId));
      if (roadmapData.length > 0) {
        const userId = roadmapData[0].userId;
        if (!userRoadmapMap.has(userId)) {
          userRoadmapMap.set(userId, []);
        }
        userRoadmapMap.get(userId)!.push({ roadmapId: step.roadmapId, step });
      }
    }

    for (const [userId, roadmapSteps] of userRoadmapMap.entries()) {
      const randomRoadmapData =
        roadmapSteps[Math.floor(Math.random() * roadmapSteps.length)];
      const roadmapData = await db
        .select()
        .from(roadmap)
        .where(eq(roadmap.id, randomRoadmapData.roadmapId));
      const userData = await db.select().from(user).where(eq(user.id, userId));

      if (userData && userData.length > 0 && roadmapData.length > 0) {
        const step = randomRoadmapData.step;

        const funMessages = [
          `🦉 Don't make me come find you! "${step.title}" is waiting. Only ${step.time} minutes to level up! 🚀`,
          `🔥 Your learning streak is crying! Complete "${step.title}" and keep that momentum going! ⚡`,
          `😢 We miss you! "${step.title}" has been lonely. Come back and smash it in ${step.time} minutes! 💪`,
          `⏰ Tick tock! Your roadmap "${roadmapData[0].title}" needs some love. Let's crush "${step.title}" together! 🎯`,
          `🌟 Legend status awaits! Complete "${step.title}" and show everyone what you're made of! 💎`,
        ];

        const randomMessage =
          funMessages[Math.floor(Math.random() * funMessages.length)];

        // await this.notificationsService.createNotification({
        //   title: 'Hey, you forgot something! 👀',
        //   content: randomMessage,
        //   userId: userData[0].id,
        // });

        await this.resendService.sendRoadmapReminderEmail(
          userData[0].email,
          userData[0].name,
          roadmapData[0].topic,
          roadmapData[0].title,
          step.title,
          step.description,
          step.time,
        );
      }
    }
  }
}
