import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccountModule,
  ],
  controllers: [
    AppController,
    AccountController
  ],
  providers: [
    AppService,
    AccountService
  ],
})
export class AppModule {}
