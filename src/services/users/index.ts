import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { IDatabase } from '../database/types';
import { IENVConfig } from '../env-config/types';
import { ILogger } from '../logger/types';
import { UserRegisterDTO } from './dto';
import { IUsers } from './types';
import { UserEntity } from './user-entity';

@injectable()
export class Users implements IUsers {
    constructor(
        @inject(TYPES.IDatabase) public database: IDatabase,
        @inject(TYPES.IENVConfig) public envConfig: IENVConfig,
        @inject(TYPES.ILogger) public logger: ILogger,
    ) {}

    // async validateUser(user: UserRegisterDTO): Promise<void> {}

    async findByEmail(email: string): Promise<User | null> {
        return this.database.prisma.user.findUnique({
            where: { email },
        });
    }

    async create({ email, first_name, last_name, password }: UserRegisterDTO): Promise<boolean> {
        const salt = Number(this.envConfig.get('SALT'));
        const user = new UserEntity({ email, first_name, last_name });
        await user.setPassword(password, salt);

        const existedUser = await this.findByEmail(email);
        if (existedUser) {
            this.logger.error(`[email] Email already exists`);
            return false;
        }

        await this.database.prisma.user.create({
            data: user,
        });

        return true;
    }
}
