import { Injectable } from '@nestjs/common';
import { DB } from '../database';
import { Person, RequestBody } from '../database/types';

@Injectable()
/**
 * The `PeopleService` is responsible for handling CRUD operations related to people.
 */
export class PeopleService {
    /**
     * The database instance for managing people data.
     */
    public readonly database: DB<Person> = new DB<Person>('people');

    /**
     * Creates a new person.
     * @param body - The data for creating the person.
     * @returns The newly created person.
     */
    async createPerson(body: RequestBody<Person>): Promise<Person> {
        return this.database.create(body);
    }

    /**
     * Lists people based on the provided ID.
     * @param id - (Optional) The ID of the person to retrieve.
     * @returns A list of people if no ID is provided, or a single person if an ID is provided.
     */
    async listPeople(): Promise<Array<Person>> {
        return this.database.find();
    }

    /**
     * Retrieves an existing person.
     * @param id - The ID of the person to retrieve.
     * @returns The person with the provided ID.
     */
    async getPerson(id: string): Promise<Person> {
        return this.database.findOne(id);
    }

    /**
     * Updates an existing person's data.
     * @param id - The ID of the person to update.
     * @param body - The updated data for the person.
     * @returns The updated person.
     */
    async updatePerson(id: string, body: RequestBody<Person>): Promise<Person> {
        return this.database.update(id, body);
    }

    /**
     * Deletes a person based on their ID.
     * @param id - The ID of the person to delete.
     * @returns The ID of the deleted person.
     */
    async deletePerson(id: string): Promise<Person['id']> {
        return this.database.delete(id);
    }
}
