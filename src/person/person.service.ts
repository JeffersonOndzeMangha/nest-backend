import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonService {
    async createPerson(body: any) {
        return body;
    }

    async listPeople(id: string) {
        return id;
    }

    async updatePerson(id: string, body: any) {
        return { id, ...body };
    }

    async deletePerson(id: string) {
        return id;
    }
}
