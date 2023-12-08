import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
    constructor(private readonly PeopleService: PeopleService) {}

    @Post('/create')
    async createPerson(
        @Body() body: any, @Res() res: any
    ) {
        try {
            const person = await this.PeopleService.createPerson(body);
            return res.status(HttpStatus.CREATED).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('')
    async listAllPeople(
        @Res() res: any
    ) {
        return res.status(HttpStatus.OK).send('Got to people');
    }

    @Get('/list')
    async listAll(
        @Res() res: any,
        @Param('id') id: string
    ) {
        try {
            const person = await this.PeopleService.listPeople(null);
            return res.status(HttpStatus.OK).json(person);
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
            const person = await this.PeopleService.listPeople(id);
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
            const person = await this.PeopleService.updatePerson(id, body);
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
            const person = await this.PeopleService.deletePerson(id);
            return res.status(HttpStatus.OK).json(person);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

}
