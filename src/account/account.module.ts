import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TransactionService } from '../transaction/transaction.service';

/**
 * The `AccountModule` encapsulates all the functionality related to managing accounts.
 * It provides services and controllers for creating, retrieving, updating, deleting accounts and more...
 */
@Module({
  providers: [AccountService, TransactionService],
  controllers: [AccountController]
})
export class AccountModule {}
