import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { IsAccountOwnerGuard } from '../guards/is-account-owner.guard';

@Controller('accounts')
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
        @Body() body: any,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.updateAccount(id, body);
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

    @Post('/deposit/:id')
    @UseGuards(IsAccountOwnerGuard)
    async depositAccount(
        @Res() res: any,
        @Body() body: any,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.deposit(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Post('/withdraw/:id')
    @UseGuards(IsAccountOwnerGuard)
    async withdrawAccount(
        @Res() res: any,
        @Body() body: any,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.withdraw(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Post('/transfer/:id')
    @UseGuards(IsAccountOwnerGuard)
    async transferAccount(
        @Res() res: any,
        @Body() body: any,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.transfer(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
