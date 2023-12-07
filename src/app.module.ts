import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { TransactionModule } from './transaction/transaction.module';
import { AccountModule } from './account/account.module';
import { PersonModule } from './person/person.module';
import { TransactionController } from './transaction/transaction.controller';
import { PersonController } from './person/person.controller';
import { TransactionService } from './transaction/transaction.service';
import { PersonService } from './person/person.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccountModule,
    TransactionModule,
    PersonModule,
  ],
  controllers: [
    AppController,
    AccountController,
    TransactionController,
    PersonController
  ],
  providers: [
    AppService,
    AccountService,
    TransactionService,
    PersonService
  ],
})
export class AppModule {}
