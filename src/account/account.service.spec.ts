import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { DB, DBProvider } from '../database';
import { Account, AccountType } from '../database/types';
import { v4 as uuid4 } from 'uuid';

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
        balance: 700,
        dailyWithdrawalLimit: 30,
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
        balance: 1000,
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
      const id = Object.keys(database.data)[0];

      const result = await accountService.deleteAccount(id);
      expect(result).toEqual(id);
    });
  });
});
