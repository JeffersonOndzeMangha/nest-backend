
type Maybe<T> = NonNullable<T> | undefined;

export enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
}

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export type Person = {
    id: string,
    name: string,
    document: string,
    birthDate: string,
    email: string,
    accounts: Array<Account['id']>,
}

export type Account = {
    id: string,
    owner: Person['id'],
    balance: number,
    dailyWithdrawalLimit: number,
    activeFlag: Maybe<String>,
    accountType: AccountType,
    createdDate: string,
    transactions: [Transaction['id']?],
}

export type Transaction = {
    id: string,
    accounts: Array<Account['id']>,
    amount: number,
    transactionDate: string,
    type: TransactionType,
    status: TransactionStatus,
}
