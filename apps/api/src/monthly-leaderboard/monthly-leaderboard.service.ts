import { Injectable } from '@nestjs/common';
import { CardsService } from 'src/cards/cards.service';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

@Injectable()
export class MonthlyLeaderboardService {
  constructor(
    private readonly cardsService: CardsService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  private monthLabel(year: number, month: number): string {
    return new Date(year, month - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  async buildPreviewPng(options: {
    year: number;
    month: number;
    theme?: 'light' | 'dark';
    mock?: boolean;
  }): Promise<Buffer> {
    const { year, month, theme, mock } = options;

    if (mock) {
      return this.cardsService.generateMonthlyLeaderboardCard({
        monthLabel: this.monthLabel(year, month),
        theme,
        entries: [
          {
            rank: 1,
            username: 'toplearner',
            name: 'Alex Chen',
            xp: 12450,
            avatarUrl: null,
          },
          {
            rank: 2,
            username: 'studyhero',
            name: 'Jordan Smith',
            xp: 9820,
            avatarUrl: null,
          },
          {
            rank: 3,
            username: 'quizking',
            name: 'Sam Rivera',
            xp: 8740,
            avatarUrl: null,
          },
        ],
      });
    }

    const leaders = await this.leaderboardService.getMonthlyXpLeaders(
      year,
      month,
    );

    if (leaders.length === 0) {
      return this.cardsService.generateMonthlyLeaderboardCard({
        monthLabel: this.monthLabel(year, month),
        theme,
        entries: [],
      });
    }

    const entries = leaders.map((l) => ({
      rank: l.rank as 1 | 2 | 3,
      username: l.user.username || 'user',
      name: l.user.name || l.user.username || 'User',
      xp: l.totalXp,
      avatarUrl: l.user.profilePictureURL,
    }));

    return this.cardsService.generateMonthlyLeaderboardCard({
      monthLabel: this.monthLabel(year, month),
      theme,
      entries,
    });
  }
}
