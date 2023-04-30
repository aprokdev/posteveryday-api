import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { IDatabase } from './types';

@injectable()
export class Database implements IDatabase {
    public instance: PrismaClient;
    constructor() {
        this.instance = new PrismaClient();
    }

    public connect(): void {
        this.instance.$connect();
    }

    public disconnect(): void {
        this.instance.$disconnect();
    }
}
