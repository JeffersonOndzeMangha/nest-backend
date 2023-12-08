import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { DB, DBProvider } from '../database';
import { Account, AccountType } from '../database/types';
import { v4 as uuid4 } from 'uuid';

export const toFixedNumber = (num: number) => Number(num.toFixed(2));

describe('AccountService', () => {
  let accountService: AccountService;
  let database: DB;

  beforeEach(async () => {
    const dbProvider = DBProvider('accounts');
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        dbProvider,
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    database = module.get<DB>(DB);
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const accountData:Account = {
        id: uuid4(),
        owner: uuid4(),
        balance: toFixedNumber(Math.random() * 10000),
        dailyWithdrawalLimit: toFixedNumber(Math.random() * 100),
        accountType: AccountType.CHECKING,
        transactions: [],
        createdDate: new Date().toLocaleDateString(),
        activeFlag: 'NONE'
      };

      const expectedResult = accountData;

      const result = await accountService.createAccount(accountData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listAccounts', () => {
    it('should list all accounts when no id is provided', async () => {
      const expectedResult = database.data;

      const result = await accountService.listAccounts(null);
      expect(result).toEqual(expectedResult);
    });

    it('should find an account when an id is provided', async () => {
      const id = Object.keys(database.data)[0];
      const expectedResult = database.data[id];

      const result = await accountService.listAccounts(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const id = Object.keys(database.data)[0];
      const accountData = {
        balance: toFixedNumber(database.data[id].balance + (Math.random() * 100)),
      }
      const expectedResult = {
        ...database.data[id],
        ...accountData,
      };

      const result = await accountService.updateAccount(id, accountData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account', async () => {
      const id = Object.keys(database.data)[Object.keys(database.data).length - 2];
      const result = await accountService.deleteAccount(id);
      expect(result).toEqual(id);
    });
  });

  describe('deposit', () => {
    it('should deposit money into an account', async () => {
      const id = Object.keys(database.data)[0];
      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
      }
      const expectedResult = {
        ...database.data[id],
        balance: database.data[id].balance + accountData.amount,
      };

      const result = await accountService.deposit(id, accountData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an account', async () => {
      const id = Object.keys(database.data)[0];
      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
      }
      const expectedResult = {
        ...database.data[id],
        balance: database.data[id].balance - accountData.amount,
      };

      const result = await accountService.withdraw(id, accountData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('transfer', () => {
    it('should transfer money from one account to another', async () => {
      const id = Object.keys(database.data)[0];
      const secondId = Object.keys(database.data)[1];

      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
        destinationAccount: secondId,
      }

      const expectedResult = {
        [id]: {
          ...database.data[id],
          balance: database.data[id].balance - accountData.amount,
        },
        [secondId]: {
          ...database.data[secondId],
          balance: database.data[secondId].balance + accountData.amount,
        },
      }

      const result = await accountService.transfer(id, accountData);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error when the destination account does not exist', async () => {
      const id = Object.keys(database.data)[0];
      const secondId = uuid4();

      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
        destinationAccount: secondId,
      }

      try {
        await accountService.transfer(id, accountData);
      } catch (error) {
        expect(error.message).toEqual('Destination account not found');
      }
    });

  });
});
