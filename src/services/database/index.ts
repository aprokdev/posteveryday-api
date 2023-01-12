import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { IDatabase } from './types';

@injectable()
export class Database implements IDatabase {
    public prismaClient: PrismaClient;
    constructor() {
        this.prismaClient = new PrismaClient();
    }

    connect(): void {
        this.prismaClient.$connect();
    }

    disconnect(): void {
        this.prismaClient.$disconnect();
    }
}
