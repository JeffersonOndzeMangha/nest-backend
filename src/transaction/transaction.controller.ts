import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
/**
 * Controller responsible for handling transactions endpoints.
 */
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('')
    /**
     * Get a list of transactions for a specific user.
     * @param res - The response object.
     * @param id - The ID of the user for whom to retrieve transactions.
     * @returns A list of transactions for the specified user or an error response.
     */
    async listTransactions(
        @Res() res: any,
    ) {
        try {
            const transaction = await this.transactionService.listTransactions();
            return res.status(HttpStatus.OK).json(transaction);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Post('/create')
    /**
     * Create a new transaction.
     * @param body - The request body containing transaction data.
     * @param res - The response object.
     * @returns The created transaction if successful, or an error response.
     */
    async createTransaction(
        @Body() body: any, @Res() res: any
    ) {
        try {
            const transaction = await this.transactionService.createTransaction(body);
            return res.status(HttpStatus.CREATED).json(transaction);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('/:id')
    /**
     * Get a specific transaction by ID.
     * @param res - The response object.
     * @param id - The ID of the transaction to retrieve.
     * @returns The requested transaction or an error response.
     */
    async getTransaction(
        @Res() res: any,
        @Param('id') id: string
    ) {
        try {
            const transaction = await this.transactionService.getTransaction(id);
            return res.status(HttpStatus.OK).json(transaction);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Put('/:id/update')
    /**
     * Update an existing transaction.
     * @param res - The response object.
     * @param id - The ID of the transaction to be updated.
     * @param body - The request body containing updated transaction data.
     * @returns The updated transaction if successful, or an error response.
     */
    async updateTransaction(
        @Res() res: any,
        @Param('id') id: string,
        @Body() body: any
    ) {
        try {
            const transaction = await this.transactionService.updateTransaction(id, body);
            return res.status(HttpStatus.OK).json(transaction);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Delete('/:id/delete')
    /**
     * Delete an existing transaction.
     * @param res - The response object.
     * @param id - The ID of the transaction to be deleted.
     * @returns The result of the delete operation or an error response.
     */
    async deleteTransaction(
        @Res() res: any,
        @Param('id') id: string
    ) {
        try {
            const transaction = await this.transactionService.deleteTransaction(id);
            return res.status(HttpStatus.OK).json(transaction);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
