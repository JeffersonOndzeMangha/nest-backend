import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

export class DB {
    public name: string;
    public data: {
        [key: string]: any
    };

    constructor(name: string) {
        this.name = name;
        this.data = this.read();
    }

    read() {
        return JSON.parse(fs.readFileSync(`src/database/${this.name}.json`, 'utf8') ?? '{}');
    }

    async write() {
        fs.writeFileSync(`src/database/${this.name}.json`, JSON.stringify(this.data));
        this.read();
    }

    async find() {
        if (this.data) return this.data;
        await this.read();
        return this.data;
    }

    async findOne(id: string) {
        return this.data[id] ?? null;
    }

    async create(newData: any) {
        const id = newData.id ?? uuidv4();
        this.data[id] = newData;
        await this.write();
        return this.data[id];
    }

    async update(id: string, newData: any) {
        this.data[id] = {...this.data[id], ...newData};
        await this.write();
        return this.data[id];
    }

    async delete(id: string) {
        delete this.data[id];
        await this.write();
        return id;
    }

    async deleteAll() {
        this.data = {};
        await this.write();
        return this.data;
    }
}

export const DBProvider = (name: string) => {
    return {
        provide: DB,
        useFactory: () => {
            const mockDatabase = {
                name: name,
                data: JSON.parse(fs.readFileSync(`src/database/${name}.json`, 'utf8') ?? '{}'),
                create: jest.fn(),
                find: jest.fn(),
                findOne: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                read: jest.fn(),
                write: jest.fn(),
                deleteAll: jest.fn(),
            };
            return mockDatabase;
        },
    };
};

// export const database = {
//     accounts: new DB('accounts'),
//     people: new DB('people'),
//     transactions: new DB('transactions'),
// };

// export const resetDatabase = async () => {
//     await database.accounts.deleteAll();
//     await database.people.deleteAll();
//     await database.transactions.deleteAll();
// };