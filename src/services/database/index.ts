import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { IDatabase } from './types';

@injectable()
export class Database implements IDatabase {
    public prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    connect(): void {
        this.prisma.$connect();
    }

    disconnect(): void {
        this.prisma.$disconnect();
    }
}
