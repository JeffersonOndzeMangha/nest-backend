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

    async deposit(id: string, body: any) {
        const account = await database.findOne(id);
        const newBalance = account.balance + body.amount;
        return database.update(id, { balance: newBalance });
    }

    async withdraw(id: string, body: any) {
        const account = await database.findOne(id);
        const newBalance = account.balance - body.amount;
        return database.update(id, { balance: newBalance });
    }

    async transfer(id: string, body: any) {
        const account = await database.findOne(id);
        const dAccount = await database.findOne(body.destinationAccount);
        if (!dAccount) {
            console.warn("Destination account not found");
            throw new Error("Destination account not found");
        }
        console.log("OLD BALANCE", account.balance);
        console.log("OLD DESTINATION BALANCE", dAccount.balance);
        const { amount, destinationAccount } = body;
        console.log("AMOUNT", amount);
        const newBalance = account.balance - amount;
        const nAccount = await database.update(id, { balance: newBalance });
        console.log("NEW BALANCE", nAccount.balance);
        const destinationAccountData = await database.findOne(destinationAccount);
        const newDestinationBalance = destinationAccountData.balance + amount;
        const nDAccount = await database.update(destinationAccount, { balance: newDestinationBalance });
        console.log("NEW DESTINATION BALANCE", nDAccount.balance);
        return {
            [id]: nAccount,
            [destinationAccount]: nDAccount,
        };
    }
}
