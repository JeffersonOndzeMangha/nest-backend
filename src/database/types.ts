type Maybe<T> = NonNullable<T> | undefined;

enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
}

export type Person = {
    id: string,
    name: string,
    document: string,
    birthDate: string,
    email: string,
    accounts: [Account['id']],
}

export type Account = {
    id: string,
    owner: Person['id'],
    balance: number,
    dailyWithdrawalLimit: number,
    activeFlag: Maybe<String>,
    accountType: AccountType,
    createdDate: Date,
    transactions: [Transaction['id']],
}

export type Transaction = {
    id: string,
    accounts: [Account['id']],
    amount: number,
    transactionDate: Date,
}
