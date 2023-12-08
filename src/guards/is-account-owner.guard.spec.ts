import { IsAccountOwnerGuard } from './is-account-owner.guard';

describe('IsAccountOwnerGuard', () => {
  it('should be defined', () => {
    expect(new IsAccountOwnerGuard()).toBeDefined();
  });

  it('should return true', async () => {
    const guard = new IsAccountOwnerGuard();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: 'fe4bf68c-4ce4-44f2-9606-1d2fce6021bd' },
          body: {
            accountOwner: 'db779333-7db1-4f2c-98d0-37808664535f',
          }
        }),
      }),
    };
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
  });
});
