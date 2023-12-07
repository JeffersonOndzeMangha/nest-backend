import { Injectable } from '@nestjs/common';
import { DB } from 'src/database';

const database = new DB('accounts');

@Injectable()
export class AccountService {
    async createAccount(body: any) {
        return body;
    }

    async listAccounts(body: any) {
        return body;
    }

    async updateAccount(body: any) {
        return body;
    }

    async deleteAccount(body: any) {
        return body;
    }
}
