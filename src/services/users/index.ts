import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { IDatabase } from '../database/types';
import { UserRegisterDTO } from './dto';
import { IUsers } from './types';

@injectable()
export class Users implements IUsers {
    constructor(@inject(TYPES.IDatabase) public database: IDatabase) {}

    async validateUser(): Promise<void> {}

    async create(user: UserRegisterDTO): Promise<User> {
        const { email, first_name, last_name, password } = user;
        return this.database.prisma.user.create({
            data: { email, first_name, last_name, password },
        });
    }
}
