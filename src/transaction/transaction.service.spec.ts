import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionType } from '../database/types';
import { DB, DBProvider } from '../database';
import { v4 as uuid4 } from 'uuid';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let database: DB;

  beforeEach(async () => {
    const dbProvider = DBProvider('transactions');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        dbProvider,
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    database = module.get<DB>(DB);
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const date = new Date().toLocaleDateString() ;
      const transactionData:Transaction = {
        id: uuid4(),
        accounts: [uuid4(), uuid4()],
        amount: 50,
        type: TransactionType.DEPOSIT,
        transactionDate: date,
      };
      const expectedResult = transactionData;

      const result = await transactionService.createTransaction(transactionData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listTransactions', () => {
    it('should list all transactions when no id is provided', async () => {
      const expectedResult = database.data;

      const result = await transactionService.listTransactions(null);
      expect(result).toEqual(expectedResult);
    });

    it('should find a transaction when an id is provided', async () => {
      const id = Object.keys(database.data)[0];
      const expectedResult = database.data[id];

      const result = await transactionService.listTransactions(id);
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
