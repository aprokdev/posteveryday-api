import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { IDatabase } from '../database/types';
import { UserRegisterDTO } from './dto';
import { IUserRepository } from './types';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(TYPES.IDatabase) public database: IDatabase) {}

    async create(user: UserRegisterDTO): Promise<User> {
        const { email, first_name, last_name, password } = user;
        return this.database.prisma.user.create({
            data: { email, first_name, last_name, password },
        });
    }
}
