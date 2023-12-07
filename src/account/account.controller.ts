import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('/create')
    async createAccount(
        @Body() body: any, @Res() res: any
    ) {
        try {
            const account = await this.accountService.createAccount(body);
            return res.status(HttpStatus.CREATED).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('/list/:id')
    async listAccounts(
        @Res() res: any,
        @Body() body: any
    ) {
        try {
            const account = await this.accountService.listAccounts(body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Put('/update/:id')
    async updateAccount(
        @Res() res: any,
        @Body() body: any
    ) {
        try {
            const account = await this.accountService.updateAccount(body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Delete('/delete/:id')
    async deleteAccount(
        @Res() res: any,
        @Body() body: any
    ) {
        try {
            const account = await this.accountService.deleteAccount(body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
