import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

/**
 * The `AccountModule` encapsulates all the functionality related to managing accounts.
 * It provides services and controllers for creating, retrieving, updating, deleting accounts and more...
 */
@Module({
  providers: [AccountService],
  controllers: [AccountController]
})
export class AccountModule {}
