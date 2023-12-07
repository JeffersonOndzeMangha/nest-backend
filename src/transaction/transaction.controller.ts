import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post('/create')
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

    @Get('/')
    async listAllTransactions(
        @Res() res: any
    ) {
        return res.status(HttpStatus.OK).send('Got to transactions');
    }

    @Get('/list/:id')
    async listTransactions(
        @Res() res: any,
        @Param('id') id: string
    ) {
        try {
            const transaction = await this.transactionService.listTransactions(id);
            return res.status(HttpStatus.OK).json(transaction);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Put('/update/:id')
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

    @Delete('/delete/:id')
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
