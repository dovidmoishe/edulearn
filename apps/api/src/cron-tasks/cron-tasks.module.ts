import { forwardRef, Module } from '@nestjs/common';
import { CronTasksService } from './cron-tasks.service';
import { CronTasksController } from './cron-tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { ExpoPushService } from 'src/common/services/expo-push.service';
import { LeaderboardModule } from 'src/leaderboard/leaderboard.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => WalletModule),
    forwardRef(() => SubscriptionModule),
    LeaderboardModule,
  ],
  providers: [CronTasksService, ExpoPushService],
  controllers: [CronTasksController],
  exports: [CronTasksService],
})
export class CronTasksModule {}
