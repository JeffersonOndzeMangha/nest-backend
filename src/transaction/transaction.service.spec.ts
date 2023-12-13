import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionStatus, TransactionType } from '../database/types';
import { DB, DBProvider } from '../database';
import { v4 as uuid4 } from 'uuid';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let database: DB<Transaction>;

  beforeEach(async () => {
    const dbProvider = DBProvider('transactions');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        dbProvider,
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    database = transactionService.database;
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const date = new Date().toLocaleDateString() ;
      const transactionData = {
        accounts: [],
        amount: 50,
        type: TransactionType.DEPOSIT,
        transactionDate: date,
        status: TransactionStatus.COMPLETED,
      };
      
      const result = await transactionService.createTransaction(transactionData);
      expect(result.id).toBeDefined();
    });
  });

  describe('listTransactions', () => {
    it('should list all transactions when no id is provided', async () => {
      const expectedResult = Object.values(database.data);

      const result = await transactionService.listTransactions();
      expect(result).toEqual(expectedResult);
    });

    it('should find a transaction when an id is provided', async () => {
      const id = Object.keys(database.data)[0];
      const expectedResult = database.data[id];

      const result = await transactionService.getTransaction(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      const id = Object.keys(database.data)[0];
      const transactionData = {
        amount: Math.random() * 100,
      };
      const expectedResult = {
        ...database.data[id],
        ...transactionData,
      };

      const result = await transactionService.updateTransaction(id, transactionData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      const id = Object.keys(database.data)[0];

      const result = await transactionService.deleteTransaction(id);
      expect(result).toEqual(id);
    });
  });
});
