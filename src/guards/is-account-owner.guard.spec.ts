import { Test, TestingModule } from '@nestjs/testing';
import { IsAccountOwnerGuard } from './is-account-owner.guard';
import { DB, DBProvider } from '../database';

describe('IsAccountOwnerGuard', () => {
  let database: DB;

  beforeEach(async () => {
    const dbProvider = DBProvider('accounts');
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        dbProvider,
      ],
    }).compile();

    database = module.get<DB>(DB);
  });

  it('should be defined', () => {
    expect(new IsAccountOwnerGuard()).toBeDefined();
  });

  it('should return true', async () => {
    const guard = new IsAccountOwnerGuard();
    const account = await database.data[Object.keys(database.data)[0]];

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: account.id },
          body: {
            accountOwner: account.owner,
          }
        }),
      }),
    };
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
  });
});
