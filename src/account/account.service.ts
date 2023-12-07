import { Injectable } from '@nestjs/common';
import { DB } from '../database';

const database = new DB('accounts');

@Injectable()
export class AccountService {
    async createAccount(body: any) {
        return database.create(body);
    }

    async listAccounts(id: any) {
        if (id) {
            return database.findOne(id);
        }
        return database.find();
    }

    async updateAccount(id: string, body: any) {
        return database.update(id, body);
    }

    async deleteAccount(id: string) {
        return database.delete(id);
    }
}
