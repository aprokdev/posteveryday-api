import { PrismaClient } from '.prisma/client';

export interface IDatabase {
    prisma: PrismaClient;
    connect: () => void;
    disconnect: () => void;
}
