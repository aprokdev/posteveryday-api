import { PrismaClient } from '.prisma/client';

export interface IDatabase {
    instance: PrismaClient;
    connect: () => void;
    disconnect: () => void;
}
