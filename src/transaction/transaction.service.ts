import { Injectable } from '@nestjs/common';
import { DB } from 'src/database';

const database = new DB('transactions');

@Injectable()
export class TransactionService {
    async createTransaction(body: any) {
        return body;
    }

    async listTransactions(id: string) {
        return id;
    }

    async updateTransaction(id: string, body: any) {
        return { id, ...body };
    }

    async deleteTransaction(id: string) {
        return id;
    }
}
