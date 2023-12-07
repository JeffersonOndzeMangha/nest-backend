import { Injectable } from '@nestjs/common';
import { DB } from '../database';

const database = new DB('transactions');

@Injectable()
export class TransactionService {
    async createTransaction(body: any) {
        return database.create(body);
    }

    async listTransactions(id: string) {
        if (id) {
            return database.findOne(id);
        }
        return database.find();
    }

    async updateTransaction(id: string, body: any) {
        return database.update(id, body);
    }

    async deleteTransaction(id: string) {
        return database.delete(id);
    }
}
