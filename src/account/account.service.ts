import { Injectable } from '@nestjs/common';
import { DB } from '../database';
import { TransactionService } from '../transaction/transaction.service';
import { Account, Transaction, TransactionStatus, TransactionType } from '../database/types';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class AccountService {
    transactionService: TransactionService;
    database: DB;

    constructor() {
        this.transactionService = new TransactionService();
        this.database = new DB('accounts');
    }
    async createAccount(body: any) {
        return this.database.create(body);
    }

    async listAccounts(id: any) {
        if (id) {
            return this.database.findOne(id);
        }
        return this.database.find();
    }

    async updateAccount(id: string, body: any) {
        return this.database.update(id, body);
    }

    async deleteAccount(id: string) {
        return this.database.delete(id);
    }

    async getBalance(id: string) {
        const account:Account = await this.database.findOne(id);
        return account.balance;
    }

    async getStatement(id: string) {
        const resp = await this.transactionService.listTransactions(null);
        const transactions = Object.values(resp).filter((transaction: Transaction) => transaction.accounts.includes(id));
        return transactions;
    }

    async deposit(id: string, body: any) {
        const account = await this.database.findOne(id);
        const transaction = await this.transactionService.createTransaction({
            id: uuid4(),
            amount: body.amount,
            type: TransactionType.DEPOSIT,
            status: TransactionStatus.PENDING,
            accounts: [id],
        });
        const newBalance = account.balance + body.amount;
        try {
            const resp = await this.database.update(id, { balance: newBalance });
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.COMPLETED });
            return resp;
        } catch (error) {
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.FAILED });
            throw error;
        }
    }

    async withdraw(id: string, body: any) {
        const account = await this.database.findOne(id);
        const transaction = await this.transactionService.createTransaction({
            id: uuid4(),
            amount: body.amount,
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.PENDING,
            accounts: [id],
        });
        const newBalance = account.balance - body.amount;
        try {
            const resp = await this.database.update(id, { balance: newBalance });
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.COMPLETED });
            return resp;
        } catch (error) {
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.FAILED });
            throw error;
        }
    }

    async transfer(id: string, body: any) {
        const { amount, destinationAccount } = body;
        const transaction = await this.transactionService.createTransaction({
            id: uuid4(),
            amount: amount,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.PENDING,
            accounts: [id, destinationAccount],
        });
        try {
            const account = await this.database.findOne(id);
            const dAccount = await this.database.findOne(destinationAccount);
            console.log("OLD BALANCE", account.balance);
            console.log("OLD DESTINATION BALANCE", dAccount.balance);
            console.log("AMOUNT", amount);
            const newBalance = account.balance - amount;
            const nAccount = await this.database.update(id, { balance: newBalance });
            console.log("NEW BALANCE", nAccount.balance);
            const newDestinationBalance = dAccount.balance + amount;
            const nDAccount = await this.database.update(destinationAccount, { balance: newDestinationBalance });
            console.log("NEW DESTINATION BALANCE", nDAccount.balance);
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.COMPLETED });
            return {
                [id]: nAccount,
                [destinationAccount]: nDAccount,
            };
        } catch (error) {
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.FAILED });
            throw error;
        }
    }
}
