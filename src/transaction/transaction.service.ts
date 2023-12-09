import { Injectable } from '@nestjs/common';
import { DB } from '../database';

@Injectable()
export class TransactionService {
    database: DB;

    constructor() {
        this.database = new DB('transactions');
    }

    async createTransaction(body: any) {
        return this.database.create({
            ...body,
            transactionDate: new Date().toLocaleDateString()
        });
    }

    async listTransactions(id: string) {
        if (id) {
            return this.database.findOne(id);
        }
        return this.database.find();
    }

    async updateTransaction(id: string, body: any) {
        return this.database.update(id, body);
    }

    async deleteTransaction(id: string) {
        return this.database.delete(id);
    }
}
