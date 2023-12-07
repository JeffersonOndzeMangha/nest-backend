import { Injectable } from '@nestjs/common';
import { DB } from '../database';

const database = new DB('people');

@Injectable()
export class PersonService {
    async createPerson(body: any) {
        return database.create(body);
    }

    async listPeople(id?: string) {
        if (id) {
            return database.findOne(id);
        }
        return database.find();
    }

    async updatePerson(id: string, body: any) {
        return database.update(id, body);
    }

    async deletePerson(id: string) {
        return database.delete(id);
    }
}
