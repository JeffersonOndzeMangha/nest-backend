import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { TransactionModule } from './transaction/transaction.module';
import { AccountModule } from './account/account.module';
import { PeopleModule } from './people/people.module';
import { TransactionController } from './transaction/transaction.controller';
import { PeopleController } from './people/people.controller';
import { TransactionService } from './transaction/transaction.service';
import { PeopleService } from './people/people.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccountModule,
    TransactionModule,
    PeopleModule,
  ],
  controllers: [
    AppController,
    AccountController,
    TransactionController,
    PeopleController
  ],
  providers: [
    AppService,
    AccountService,
    TransactionService,
    PeopleService
  ],
})
export class AppModule {}
