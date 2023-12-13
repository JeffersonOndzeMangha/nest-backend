import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { Account, AccountType, Transaction } from '../database/types';
import { v4 as uuid4 } from 'uuid';
import { TransactionService } from '../transaction/transaction.service';
import { PeopleService } from '../people/people.service';
import { toFixedNumber } from '../utils/helper-functions';

describe('AccountService', () => {
  let accountService: AccountService;
  let transactionService: TransactionService;
  let peopleService: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        TransactionService,
        PeopleService
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    transactionService = module.get<TransactionService>(TransactionService);
    peopleService = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const person = await peopleService.createPerson({ name: 'Test Person' });
      const accountData = {
        owner: person.id,
        balance: toFixedNumber(Math.random() * 10000),
        dailyWithdrawalLimit: toFixedNumber(Math.random() * 100),
        accountType: AccountType.CHECKING,
        transactions: [],
        createdDate: new Date().toLocaleDateString(),
        activeFlag: 'NONE',
      };

      const result = await accountService.createAccount(accountData);
      expect(result.id).toBeDefined();
    });
  });

  describe('getAccountAndInfo', () => {

    it('should get an account and its info', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const expectedResult = accountService.database.data[id];
      const result = await accountService.getAccount(id);
      expect(result).toEqual(expectedResult);
    });

    it('should get an account balance', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const expectedResult = accountService.database.data[id].balance;
      console.log("EXPECTED Balance", expectedResult);
      const result = await accountService.getBalance(id);
      console.log("RESULT Balance", result);
      expect(result).toEqual(expectedResult);
    });

    it('should get an account statement', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const expectedResult = Object.values(transactionService.database.data).filter((transaction: Transaction) => transaction.accounts?.includes(id));
      console.log("EXPECTED Transactions", expectedResult.length);
      const result = await accountService.getStatement(id);
      console.log("RESULT Transactions", result.length);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listAccounts', () => {
    it('should list all accounts when no id is provided', async () => {
      const expectedResult = Object.values(accountService.database.data);

      const result = await accountService.listAccounts();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const accountData = {
        balance: toFixedNumber(accountService.database.data[id].balance + (Math.random() * 100)),
      }
      const expectedResult = {
        ...accountService.database.data[id],
        ...accountData,
      };

      const result = await accountService.updateAccount(id, accountData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account', async () => {
      const id = Object.keys(accountService.database.data)[Object.keys(accountService.database.data).length - 2];
      const result = await accountService.deleteAccount(id);
      expect(result).toEqual(id);
    });
  });

  describe('deposit', () => {
    it('should deposit money into an account', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
      }
      const expectedResult = {
        ...accountService.database.data[id],
        balance: accountService.database.data[id].balance + accountData.amount,
      };

      const result = await accountService.deposit(id, accountData);
      expect(result.balance).toEqual(expectedResult.balance);
      expect(result.transactions.length).toEqual(expectedResult.transactions.length + 1);
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an account', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
      }
      const expectedResult = {
        ...accountService.database.data[id],
        balance: accountService.database.data[id].balance - accountData.amount,
      };

      const result = await accountService.withdraw(id, accountData);
      expect(result.balance).toEqual(expectedResult.balance);
      expect(result.transactions.length).toEqual(expectedResult.transactions.length + 1);
    });
  });

  describe('transfer', () => {
    it('should transfer money from one account to another', async () => {
      const id = Object.keys(accountService.database.data)[2];
      const secondId = Object.keys(accountService.database.data)[1];

      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
        destinationAccount: secondId,
      }

      const expectedResult = {
        ...accountService.database.data[id],
        balance: accountService.database.data[id].balance - accountData.amount,
      }

      const result = await accountService.transfer(id, accountData);
      expect(result.balance).toEqual(expectedResult.balance);
      expect(result.transactions.length).toEqual(expectedResult.transactions.length + 1);
    });

    it('should throw an error when an account does not exist', async () => {
      const id = Object.keys(accountService.database.data)[0];
      const secondId = uuid4();

      const accountData = {
        amount: toFixedNumber(Math.random() * 100),
        destinationAccount: secondId,
      }

      try {
        await accountService.transfer(id, accountData);
      } catch (error) {
        console.log("ERROR", error)
        expect(error.message).toBe('account not found');
      }
    });

  });
});