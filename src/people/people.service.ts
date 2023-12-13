import { Injectable, Logger } from '@nestjs/common';
import { DB } from '../database';
import { Person, RequestBody } from '../database/types';

@Injectable()
/**
 * The `PeopleService` is responsible for handling CRUD operations related to people.
 */
export class PeopleService {
    private readonly logger = new Logger(PeopleService.name);
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
        try {
            const person = await this.database.create(body);
            return person as Person;
        } catch (error) {
            this.logger.error(`Error creating person: ${error.message}`);
            throw error;
        }
    }

    /**
     * Lists people based on the provided ID.
     * @param id - (Optional) The ID of the person to retrieve.
     * @returns A list of people if no ID is provided, or a single person if an ID is provided.
     */
    async listPeople(): Promise<Array<Person>> {
        try {
            return this.database.find();
        } catch (error) {
            this.logger.error(`Error listing people: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieves an existing person.
     * @param id - The ID of the person to retrieve.
     * @returns The person with the provided ID.
     */
    async getPerson(id: string): Promise<Person> {
        try {
            return this.database.findOne(id);
        } catch (error) {
            this.logger.error(`Error retrieving person: ${error.message}`);
            throw error;
        }
    }

    /**
     * Updates an existing person's data.
     * @param id - The ID of the person to update.
     * @param body - The updated data for the person.
     * @returns The updated person.
     */
    async updatePerson(id: string, body: RequestBody<Person>): Promise<Person> {
        try {
            const person = await this.database.update(id, body);
            return person;
        } catch (error) {
            this.logger.error(`Error updating person: ${error.message}`);
            throw error;
        }
    }

    /**
     * Deletes a person based on their ID.
     * @param id - The ID of the person to delete.
     * @returns The ID of the deleted person.
     */
    async deletePerson(id: string): Promise<Person['id']> {
        try {
            const person = await this.database.delete(id);
            return person;
        } catch (error) {
            this.logger.error(`Error deleting person: ${error.message}`);
            throw error;
        }
    }
}
