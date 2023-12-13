import { Injectable, Logger } from '@nestjs/common';
import { DB } from '../database';
import { TransactionService } from '../transaction/transaction.service';
import { Account, RequestBody, TransactionStatus, TransactionType, TransactionRequestBody, Transaction } from '../database/types';

@Injectable()
/**
 * The `AccountService` is responsible for handling CRUD operations related to accounts.
 */
export class AccountService {
    private readonly logger = new Logger(AccountService.name);
    /**
     * The database instance for managing accounts data.
     */
    public readonly database: DB<Account> = new DB<Account>('accounts');

    /**
     * Initializes an instance of the AccountService.
     * @param transactionService The TransactionService instance for managing transactions.
     */
    constructor(
        private transactionService: TransactionService,
    ) {}

    /**
     * Creates a new account.
     * @param body The request body containing account data.
     * @returns The newly created account.
     * @throws If an error occurs while creating the account.
     */
    async createAccount(body: RequestBody<Account>): Promise<Account> {
        try {
            const account = await this.database.create(body);
            return account as Account;
        } catch (error) {
            this.logger.error(`Error creating account: ${error.message}`);
            throw error;
        }
    }

    /**
     * Lists accounts based on the provided ID or retrieves all accounts if ID is not provided.
     * @param id The ID of the account to retrieve (optional).
     * @returns A single account if ID is provided or a list of all accounts.
     * @throws If an error occurs while listing accounts.
     */
    async listAccounts(): Promise<Array<Account>> {
        try {
            return this.database.find();
        } catch (error) {
            this.logger.error(`Error listing accounts: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieves an existing account.
     * @param id The ID of the account to retrieve.
     * @returns The account with the provided ID.
     * @throws If an error occurs while retrieving the account.
     */
    async getAccount(id: string): Promise<Account> {
        try {
            return this.database.findOne(id);
        } catch (error) {
            this.logger.error(`Error getting account: ${error.message}`);
            throw error;
        }
    }

    /**
     * Updates an existing account.
     * @param id The ID of the account to update.
     * @param body The request body containing updated account data.
     * @returns The updated account.
     * @throws If an error occurs while updating the account.
     */
    async updateAccount(id: string, body: RequestBody<Account>): Promise<Account> {
        try {
            const updatedAccount = await this.database.update(id, body);
            return updatedAccount;
        } catch (error) {
            this.logger.error(`Error updating account: ${error.message}`);
            throw error;
        }
    }

    /**
     * Deletes an existing account.
     * @param id The ID of the account to delete.
     * @returns The ID of the deleted account.
     * @throws If an error occurs while deleting the account.
     */
    async deleteAccount(id: string): Promise<Account['id']> {
        try {
            return this.database.delete(id);
        } catch (error) {
            this.logger.error(`Error deleting account: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieves the balance of an account.
     * @param id The ID of the account to get the balance for.
     * @returns The balance of the account.
     * @throws If an error occurs while retrieving the balance.
     */
    async getBalance(id: string): Promise<Account['balance']> {
        try {
            const account: Account = await this.database.findOne(id);
            return account.balance;
        } catch (error) {
            this.logger.error(`Error getting balance: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieves the statement (list of transactions) for an account.
     * @param id The ID of the account to get the statement for.
     * @returns The list of transactions for the account.
     * @throws If an error occurs while retrieving the statement.
     */
    async getStatement(id: string): Promise<Array<Transaction>> {
        try {
            const transactions = await this.transactionService.listTransactions();
            return Object.values(transactions).filter((transaction) => transaction.accounts?.includes(id));
        } catch (error) {
            this.logger.error(`Error getting statement: ${error.message}`);
            throw error;
        }
    }

    /**
     * Deposits a specified amount into an account.
     * @param id The ID of the account to deposit into.
     * @param body The request body containing the deposit details.
     * @returns The updated account with the new balance.
     * @throws If an error occurs during the deposit operation.
     */
    async deposit(id: string, body: TransactionRequestBody): Promise<Account> {
        const transaction = await this.transactionService.createTransaction({
            amount: body.amount,
            type: TransactionType.DEPOSIT,
            status: TransactionStatus.PENDING,
            accounts: [id],
        });
        this.logger.log("TRANSACTION", transaction)
        try {
            const account = await this.database.findOne(id);
            const newBalance = account.balance + body.amount;
            const updatedAccount = await this.database.update(id, { balance: newBalance, transactions: account.transactions.concat(transaction.id) });
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.COMPLETED });
            return updatedAccount;
        } catch (error) {
            this.logger.error(`Error depositing: ${error.message}`);
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.FAILED });
            throw error;
        }
    }

    /**
     * Withdraws a specified amount from an account.
     * @param id The ID of the account to withdraw from.
     * @param body The request body containing the withdrawal details.
     * @returns The updated account with the new balance.
     * @throws If an error occurs during the withdrawal operation.
     */
    async withdraw(id: string, body: TransactionRequestBody): Promise<Account> {
        const transaction = await this.transactionService.createTransaction({
            amount: body.amount,
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.PENDING,
            accounts: [],
        });
        try {
            const account = await this.database.findOne(id);
            const newBalance = account.balance - body.amount;
            const updatedAccount = await this.database.update(id, { balance: newBalance, transactions: account.transactions.concat(transaction.id) });
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.COMPLETED, accounts: transaction.accounts.concat(id) });
            return updatedAccount;
        } catch (error) {
            this.logger.error(`Error withdrawing: ${error.message}`);
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.FAILED });
            throw error;
        }
    }

    /**
     * Transfers a specified amount from one account to another.
     * @param id The ID of the source account for the transfer.
     * @param body The request body containing transfer details.
     * @returns The updated account with the new balance.
     * @throws If an error occurs during the transfer operation.
     */
    async transfer(id: string, body: TransactionRequestBody): Promise<Account> {
        const transaction = await this.transactionService.createTransaction({
            amount: body.amount,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.PENDING,
            accounts: [],
        });

        try {
            const { amount, destinationAccount } = body;
            const account = await this.database.findOne(id);// can create a balance increment/decriment function in database so we don't have to find the account then update it.
            const dAccount = await this.database.findOne(destinationAccount);
            const newBalance = account.balance - amount;
            const updatedAccount = await this.database.update(id, { balance: newBalance, transactions: account.transactions.concat(transaction.id) });
            const newDestinationBalance = dAccount.balance + amount;
            await this.database.update(destinationAccount, { balance: newDestinationBalance, transactions: dAccount.transactions.concat(transaction.id) });
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.COMPLETED, accounts: transaction.accounts.concat(id, destinationAccount) });
            return updatedAccount;
        } catch (error) {
            this.logger.error(`Error transferring: ${error.message}`);
            await this.transactionService.updateTransaction(transaction.id, { status: TransactionStatus.FAILED });
            throw error;
        }
    }
}
