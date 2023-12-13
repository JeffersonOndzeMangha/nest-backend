import { Test, TestingModule } from '@nestjs/testing';
import { IsAccountOwnerGuard } from './is-account-owner.guard';
import { DB, DBProvider } from '../database';
import { Account } from '../database/types';

describe('IsAccountOwnerGuard', () => {
  let database: DB<Account>;

  beforeEach(async () => {
    const dbProvider = DBProvider('accounts');
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        dbProvider,
      ],
    }).compile();

    database = module.get<DB<Account>>(DB);
  });

  it('should be defined', () => {
    expect(new IsAccountOwnerGuard()).toBeDefined();
  });

  it('should return true', async () => {
    const guard = new IsAccountOwnerGuard();
    const account = database.data[Object.keys(database.data)[0]];

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: account.id },
          headers: {
            'x-api-key': '123',
            'account-owner': account.owner,
          }
        }),
      }),
    };
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
  });

  it('should return an error', async () => {
    const guard = new IsAccountOwnerGuard();
    const account = database.data[Object.keys(database.data)[0]];

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: account.id },
          headers: {
            'x-api-key': '123',
            'account-owner': 'not-the-owner',
          }
        }),
      }),
    };
    try {
      await guard.canActivate(context as any);
    } catch (error) {
      expect(error.message).toEqual('Unauthorized');
    }
  });

});
