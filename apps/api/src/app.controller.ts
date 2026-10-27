import { Controller, Get, GoneException, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Retired endpoint for installed clients that still offer account linking.
  @Post('twitter/callback')
  retiredAccountConnection(): never {
    throw new GoneException(
      'Account linking is no longer available. Your EduLearn username is independent. Please update the app.',
    );
  }
}
