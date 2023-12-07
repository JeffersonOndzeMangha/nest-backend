import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class DB {
    public name: string;
    public data: {
        [key: string]: any
    };

    constructor(name: string) {
        this.name = name;
        this.data = JSON.parse(fs.readFileSync(`../database/${name}.json`, 'utf8'));
    }

    private async write() {
        fs.writeFileSync(`../database/${this.name}.json`, JSON.stringify(this.data));
    }

    async find() {
        return this.data;
    }

    async findOne(id: string) {
        return this.data[id];
    }

    async create(newData: any) {
        const id = uuidv4();
        this.data[id] = newData;
        await this.write();
        return this.data[id];
    }

    async update(id: string, newData: any) {
        this.data[id] = {...this.data[id], ...newData};
        await this.write();
        return newData;
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