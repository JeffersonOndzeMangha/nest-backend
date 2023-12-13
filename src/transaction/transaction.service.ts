import { Injectable, Logger } from '@nestjs/common';
import { DB } from '../database';
import { RequestBody, Transaction } from '../database/types';

@Injectable()
/**
 * The `TransactionService` is responsible for handling CRUD operations related to transactions.
 */
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
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
        try {
            const transaction = await this.database.create({...body, transactionDate: new Date().toISOString()});
            return transaction as Transaction;
        } catch (error) {
            this.logger.error(`Error creating transaction: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get a list of all transactions.
     * @returns A list of all transactions.
     */
    async listTransactions(): Promise<Array<Transaction>> {
        try {
            return this.database.find();
        } catch (error) {
            this.logger.error(`Error listing transactions: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get a specific transaction by ID.
     * @param id - The ID of the transaction to retrieve.
     * @returns The requested transaction.
     */
    async getTransaction(id: string): Promise<Transaction> {
        try {
            return this.database.findOne(id);
        } catch (error) {
            this.logger.error(`Error retrieving transaction: ${error.message}`);
            throw error;
        }
    }

    /**
     * Update a specific transaction by ID.
     * @param id - The ID of the transaction to update.
     * @param body - The request body containing updated transaction data.
     * @returns The updated transaction.
     */
    async updateTransaction(id: string, body: RequestBody<Transaction>): Promise<Transaction> {
        try {
            const transaction = await this.database.update(id, body);
            return transaction as Transaction;
        } catch (error) {
            this.logger.error(`Error updating transaction: ${error.message}`);
            throw error;
        }
    }

    /**
     * Delete a specific transaction by ID.
     * @param id - The ID of the transaction to delete.
     * @returns The deleted transaction.
     */
    async deleteTransaction(id: string): Promise<string> {
        try {
            const transactionId = await this.database.delete(id);
            return transactionId;
        } catch (error) {
            this.logger.error(`Error deleting transaction: ${error.message}`);
            throw error;
        }
    }
}

