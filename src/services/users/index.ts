import { HTTPError, HTTPError422 } from '@errors/index';
import { IDatabase } from '@services/database/types';
import { IENVConfig } from '@services/env-config/types';
import { ILogger } from '@services/logger/types';
import { IUser, validatePassword } from '@utils/user-entity';
import { inject, injectable } from 'inversify';
import TYPES from 'inversify.types';
import { sign } from 'jsonwebtoken';
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

    async findByEmail(email: string): Promise<IUser | null> {
        return this.database.prismaClient.user.findUnique({
            where: { email },
        });
    }

    async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
        if (!email || !password) {
            throw new HTTPError422('"email" and "password" fields are required');
        }
        const existedUser = await this.findByEmail(email);
        if (!existedUser) {
            throw new HTTPError422('Provided credentials are invalid');
        }
        return validatePassword(password, existedUser.hash, existedUser.salt);
    }

    async create(body: UserRegisterDTO): Promise<IUser> {
        // check if user already exist:
        const existedUser = await this.findByEmail(body.email);
        if (existedUser) {
            throw new HTTPError422('User with provided email is already exist');
        }
        const newUser = new UserEntity(body);
        return await this.database.prismaClient.user.create({ data: newUser });
    }

    async signToken(email: string): Promise<string> {
        const secret = this.envConfig.get('TOKEN_SECRET');
        if (!secret) {
            throw new Error('TOKEN_SECRET is absent in .env file');
        } else {
            return await sign(email, secret, { algorithm: 'HS256' });
        }
    }
}
