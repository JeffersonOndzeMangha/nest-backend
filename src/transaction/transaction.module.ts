import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

/**
 * The `TransactionModule` encapsulates all the functionality related to managing transactions.
 * It provides services and controllers for creating, retrieving, updating, deleting transactions and more...
 */
@Module({
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
