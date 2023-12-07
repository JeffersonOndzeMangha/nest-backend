import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @Post('/create')
    async createPerson(
        @Body() body: any, @Res() res: any
    ) {
        try {
            const person = await this.personService.createPerson(body);
            return res.status(HttpStatus.CREATED).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('/list/:id')
    async listPeople(
        @Res() res: any,
        @Param('id') id: string
    ) {
        try {
            const person = await this.personService.listPeople(id);
            return res.status(HttpStatus.OK).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Put('/update/:id')
    async updatePerson(
        @Res() res: any,
        @Param('id') id: string,
        @Body() body: any
    ) {
        try {
            const person = await this.personService.updatePerson(id, body);
            return res.status(HttpStatus.OK).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Delete('/delete/:id')
    async deletePerson(
        @Res() res: any,
        @Param('id') id: string
    ) {
        try {
            const person = await this.personService.deletePerson(id);
            return res.status(HttpStatus.OK).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

}
