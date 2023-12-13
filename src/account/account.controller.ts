import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { IsAccountOwnerGuard } from '../guards/is-account-owner.guard';
import { Account, AccountFlag, RequestBody } from '../database/types';
import { Response } from 'express';

@Controller('accounts')
/**
 * Controller responsible for account management routes and handling.
 */
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get('')
    /**
     * List all accounts.
     * @param res - Response object.
     * @returns List of accounts or an error response.
     */
    async listAccounts( // TODO: Add guard to ensure only admin can list all accounts or list accounts by owner.
        @Res() res: Response,
    ) {
        try {
            const account = await this.accountService.listAccounts();
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Post('/create')
    /**
     * Create a new account.
     * @param body - Request body containing account data.
     * @param res - Response object.
     * @returns The created account or an error response.
     */
    async createAccount(
        @Body() body: RequestBody<Account>, @Res() res: Response
    ) {
        try {
            const account = await this.accountService.createAccount(body);
            return res.status(HttpStatus.CREATED).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Get('/:id')
    /**
     * Get account by ID.
     * @param res - Response object.
     * @param id - Account ID.
     * @returns The account or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async getAccount(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.getAccount(id);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Put('/:id/update')
    /**
     * Update an account by ID.
     * @param res - Response object.
     * @param body - Request body containing account data to update.
     * @param id - Account ID.
     * @returns The updated account or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async updateAccount(
        @Res() res: Response,
        @Body() body: RequestBody<Account>,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.updateAccount(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Put('/:id/block')
    /**
     * Block an account by ID.
     * @param res - Response object.
     * @param id -  Account ID.
     * @returns The blocked account ID or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async blockAccount(
        @Res() res: Response,
        @Param('id') id: Account['id']
    ) {
        try {
            const account = await this.accountService.updateAccount(id, { activeFlag: AccountFlag.BLOCKED });
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Delete('/:id/delete')
    /**
     * Delete an account by ID.
     * @param res - Response object.
     * @param body - Request body containing the account ID to delete.
     * @returns The deleted account ID or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async deleteAccount(
        @Res() res: Response,
        @Param('id') id: Account['id']
    ) {
        try {
            const account = await this.accountService.deleteAccount(id);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Post('/:id/deposit')
    /**
     * Deposit money into an account.
     * @param res - Response object.
     * @param body - Request body containing the deposit amount.
     * @param id - Account ID.
     * @returns The updated account or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async depositAccount(
        @Res() res: Response,
        @Body() body: RequestBody<Account>,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.deposit(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    
    @Post('/:id/withdraw')
    /**
     * Withdraw money from an account.
     * @param res - Response object.
     * @param body - Request body containing the withdrawal amount.
     * @param id - Account ID.
     * @returns The updated account or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async withdrawAccount(
        @Res() res: Response,
        @Body() body: RequestBody<Account>,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.withdraw(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    
    @Post('/:id/transfer')
    /**
     * Transfer money from one account to another.
     * @param res - Response object.
     * @param body - Request body containing transfer details (amount, destination account).
     * @param id - Source account ID.
     * @returns The updated source and destination accounts or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async transferAccount(
        @Res() res: Response,
        @Body() body: RequestBody<Account>,
        @Param('id') id: string
    ) {
        try {
            const account = await this.accountService.transfer(id, body);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    
    @Get('/:id/balance')
    /**
     * Get account balance by ID.
     * @param res - Response object.
     * @param id - Account ID.
     * @returns The account balance or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async getBalance(
        @Res() res: Response,
        @Param('id') id: Account['id']
    ) {
        try {
            const account = await this.accountService.getBalance(id);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    
    @Get('/:id/statement')
    /**
     * Get account statement by ID.
     * @param res - Response object.
     * @param id - Account ID.
     * @returns The account statement or an error response.
     */
    @UseGuards(IsAccountOwnerGuard)
    async getStatement(
        @Res() res: Response,
        @Param('id') id: Account['id']
    ) {
        try {
            const account = await this.accountService.getStatement(id);
            return res.status(HttpStatus.OK).json(account);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
