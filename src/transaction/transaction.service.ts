import { Injectable } from '@nestjs/common';
import { DB } from '../database';
import { RequestBody, Transaction } from '../database/types';

@Injectable()
/**
 * The `TransactionService` is responsible for handling CRUD operations related to transactions.
 */
export class TransactionService {
    /**
     * The database instance for managing transactions data.
     */
    public readonly database: DB<Transaction> = new DB<Transaction>('transactions');

    /**
     * Create a new transaction.
     * @param body - The request body containing transaction data.
     * @returns The newly created transaction.
     */
    async createTransaction(body: RequestBody<Transaction>): Promise<Transaction> {
        return this.database.create({
            ...body,
            transactionDate: new Date().toLocaleDateString(),
        });
    }

    /**
     * Get a list of all transactions.
     * @returns A list of all transactions.
     */
    async listTransactions(): Promise<Array<Transaction>> {
        return this.database.find();
    }

    /**
     * Get a specific transaction by ID.
     * @param id - The ID of the transaction to retrieve.
     * @returns The requested transaction.
     */
    async getTransaction(id: string): Promise<Transaction> {
        return await this.database.findOne(id);
    }

    /**
     * Update a specific transaction by ID.
     * @param id - The ID of the transaction to update.
     * @param body - The request body containing updated transaction data.
     * @returns The updated transaction.
     */
    async updateTransaction(id: string, body: RequestBody<Transaction>): Promise<Transaction> {
        return await this.database.update(id, body);
    }

    /**
     * Delete a specific transaction by ID.
     * @param id - The ID of the transaction to delete.
     * @returns The deleted transaction.
     */
    async deleteTransaction(id: string) {
        return await this.database.delete(id);
    }
}

