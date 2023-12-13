// Define a custom Maybe type that represents a value that can either be non-null or undefined.
type Maybe<T> = NonNullable<T> | undefined;

// Define an enumeration of account types.
export enum AccountType {
    CHECKING = 'CHECKING', // Checking account type.
    SAVINGS = 'SAVINGS',   // Savings account type.
}

// Define an enumeration of transaction types.
export enum TransactionType {
    DEPOSIT = 'DEPOSIT',       // Deposit transaction type.
    WITHDRAWAL = 'WITHDRAWAL', // Withdrawal transaction type.
    TRANSFER = 'TRANSFER',     // Transfer transaction type.
}

// Define an enumeration of transaction status values.
export enum TransactionStatus {
    PENDING = 'PENDING',   // Transaction is pending.
    COMPLETED = 'COMPLETED', // Transaction has been completed successfully.
    FAILED = 'FAILED',     // Transaction has failed.
}

// Define a Person type representing an individual.
export type Person = {
    id: string;           // Unique identifier for the person.
    name: string;     // Name of the person.
    document?: string; // Optional document information.
    birthDate: string; // Date of birth of the person.
    email: string;    // Email address of the person.
    accounts?: Array<Account['id']>; // Optional array of account IDs associated with the person.
}

// Define an Account type representing a bank account.
export type Account = {
    id: string; // Unique identifier for the account.
    owner: Person['id']; // ID of the account owner (a person).
    balance: number; // Current balance of the account.
    dailyWithdrawalLimit: number; // Daily withdrawal limit for the account.
    activeFlag: Maybe<String>; // Optional flag indicating the account's status.
    accountType: AccountType; // Type of the account (e.g., CHECKING or SAVINGS).
    createdDate: string; // Date when the account was created.
    transactions: Array<Transaction['id']>; // Optional array of transaction IDs associated with the account.
}

// Define a Transaction type representing a financial transaction.
export type Transaction = {
    id: string; // Unique identifier for the transaction.
    accounts: Array<Account['id']>; // Array of account IDs involved in the transaction.
    amount: number; // Transaction amount.
    transactionDate: string; // Date when the transaction occurred.
    type: TransactionType; // Type of the transaction (e.g., DEPOSIT, WITHDRAWAL, or TRANSFER).
    status: TransactionStatus; // Status of the transaction (e.g., PENDING, COMPLETED, or FAILED).
}

// Define a generic type that can represent any of the 3 types above
export type Entity = Person | Account | Transaction;

// Define a RequestBody type representing a partial request body for different entities (Person, Account, Transaction).
// It allows for optional attributes but enforces that the body cannot be empty.
export type RequestBody<T> = Partial<Omit<T, 'id' | 'accounts'>> & { accounts?: Array<Account['id']> };
export type TransactionRequestBody = RequestBody<Transaction> & { destinationAccount?: Account['id'] };

// Can define a type for database CreateCreateInput that is a partial of the entity type as well as an UpdateInput type
// export type CreateInput<T> = Partial<Omit<T, 'id'>>;


