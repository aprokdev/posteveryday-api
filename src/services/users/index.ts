import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { HTTPError } from '../../errors';
import TYPES from '../../inversify.types';
import { IDatabase } from '../database/types';
import { IENVConfig } from '../env-config/types';
import { ILogger } from '../logger/types';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import { IUsers } from './types';
import { UserEntity } from './user-entity';

@injectable()
export class Users implements IUsers {
    constructor(
        @inject(TYPES.IDatabase) public database: IDatabase,
        @inject(TYPES.IENVConfig) public envConfig: IENVConfig,
        @inject(TYPES.ILogger) public logger: ILogger,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.database.prismaClient.user.findUnique({
            where: { email },
        });
    }

    async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
        const existedUser = await this.findByEmail(email);
        if (!existedUser) {
            throw new HTTPError(401, 'There is no user with provided email');
        }
        return await UserEntity.comparePassword(password, existedUser.password);
    }

    async create({ email, first_name, last_name, password }: UserRegisterDTO): Promise<boolean> {
        // check if user already exist:
        const existedUser = await this.findByEmail(email);
        if (existedUser) {
            this.logger.error(`Email [${email}] already exists`);
            return false;
        }

        const salt = this.envConfig.get('SALT');
        if (salt) {
            const user = new UserEntity({ email, first_name, last_name });
            await user.setPassword(password, Number(salt));

            await this.database.prismaClient.user.create({
                data: user,
            });

            return true;
        }
        throw new Error("Unable to get 'SALT' property from .env");
    }
}
