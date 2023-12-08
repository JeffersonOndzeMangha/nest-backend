import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DB } from '../database';
const database = new DB('accounts');

@Injectable()
export class IsAccountOwnerGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { params: { id }, body: { accountOwner } } = context.switchToHttp().getRequest();
    const account = await database.findOne(id);
    const resp = !id || !accountOwner || !account || account.owner != accountOwner ? false : true;
    if (!resp) throw new Error('Unauthorized');
    return resp;
  }
}
