import { PrismaClient } from '.prisma/client';

export interface IDatabase {
    prismaClient: PrismaClient;
    connect: () => void;
    disconnect: () => void;
}
