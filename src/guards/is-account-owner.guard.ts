import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DB } from '../database';
import { Account } from '../database/types';

/**
 * The `IsAccountOwnerGuard` is a NestJS guard that checks if a user is the owner of a specific account.
 * It verifies if the provided `accountOwner` matches the owner of the account with the given `id`.
 * If the user is the owner, the request is allowed to proceed; otherwise, it's denied with an 'Unauthorized' error.
 */
@Injectable()
export class IsAccountOwnerGuard implements CanActivate {
  /**
   * Determines whether the request should be allowed or denied based on the ownership of the account.
   * @param context - The execution context of the request.
   * @returns A boolean indicating whether the request should be allowed.
   * @throws Error if the request is unauthorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params: { id }, headers } = context.switchToHttp().getRequest();
    const database: DB<Account> = new DB('accounts');
    const accountOwner = headers['account-owner'];
    try {
    const account = await database.findOne(id);
    const isAuthorized = !id || !accountOwner || !account || account.owner !== accountOwner ? false : true;

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    return isAuthorized;
    } catch (error) {
      throw error;
    }
  }
}
