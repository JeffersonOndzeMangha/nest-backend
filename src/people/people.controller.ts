import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PeopleService } from './people.service';
import { Response } from 'express';
import { Person, RequestBody } from '../database/types';

@Controller('people')
/**
 * Controller responsible for people management routes and handling.
 */
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) {}

    @Post('/create')
    /**
     * Create a new person.
     * @param body - The request body containing person data.
     * @param res - The HTTP response object.
     * @returns The newly created person.
     */
    async createPerson(
        @Body() body: RequestBody<Person>, @Res() res: Response
    ) {
        try {
            const person = await this.peopleService.createPerson(body);
            return res.status(HttpStatus.CREATED).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('/list/:id?')
    /**
     * Get a list of all people or a specific person by ID.
     * @param res - The HTTP response object.
     * @param id - The ID of the person to retrieve (optional).
     * @returns A list of all people or the requested person.
     */
    async listPeople(
        @Res() res: Response,
        @Param('id') id?: Person['id']
    ) {
        try {
            const people = id
                ? await this.peopleService.getPerson(id)
                : await this.peopleService.listPeople();
            return res.status(HttpStatus.OK).json(people);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Put('/update/:id')
    /**
     * Update a specific person by ID.
     * @param res - The HTTP response object.
     * @param id - The ID of the person to update.
     * @param body - The request body containing updated person data.
     * @returns The updated person.
     */
    async updatePerson(
        @Res() res: Response,
        @Param('id') id: Person['id'],
        @Body() body: RequestBody<Person>
    ) {
        try {
            const person = await this.peopleService.updatePerson(id, body);
            return res.status(HttpStatus.OK).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Delete('/delete/:id')
    /**
     * Delete a specific person by ID.
     * @param res - The HTTP response object.
     * @param id - The ID of the person to delete.
     * @returns The deleted person.
     */
    async deletePerson(
        @Res() res: Response,
        @Param('id') id: Person['id']
    ) {
        try {
            const person = await this.peopleService.deletePerson(id);
            return res.status(HttpStatus.OK).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
