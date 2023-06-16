import { HTTPError422 } from '@errors/index';
import { IDatabase } from '@services/database/types';
import { IENVConfig } from '@services/env-config/types';
import { validatePassword } from '@services/users/user-entity';
import { UserEntity } from '@services/users/user-entity';
import TYPES from '@src/inversify.types';
import { inject, injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UserLoginDTO, UserRegisterDTO } from './dto';
import { IUser, IUsers } from './types';

@injectable()
export class Users implements IUsers {
    constructor(
        @inject(TYPES.IDatabase) private _db: IDatabase,
        @inject(TYPES.IENVConfig) private _env: IENVConfig,
    ) {}

    public async findByEmail(email: string): Promise<IUser | null> {
        return await this._db.instance.user.findUnique({
            where: { email },
        });
    }

    public async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
        if (!email || !password) {
            throw new HTTPError422('"email" and "password" fields are required');
        }
        const existedUser = await this.findByEmail(email);
        if (!existedUser) {
            throw new HTTPError422('Provided credentials are invalid');
        }
        return validatePassword(password, existedUser.hash, existedUser.salt);
    }

    public async create(body: UserRegisterDTO): Promise<IUser> {
        // check if user already exist:
        const existedUser = await this.findByEmail(body.email);
        if (existedUser) {
            throw new HTTPError422('User with provided email is already exist');
        }
        const newUser = new UserEntity(body);
        return await this._db.instance.user.create({ data: newUser });
    }

    public async signToken(email: string): Promise<string> {
        const secret = this._env.get('TOKEN_SECRET');
        if (!secret) {
            throw new Error('TOKEN_SECRET is absent in .env file');
        } else {
            return await sign({ email }, secret, {
                algorithm: 'HS256',
                expiresIn: '8h',
            });
        }
    }

    public verifyToken(token: string): Promise<string> {
        const secret = this._env.get('TOKEN_SECRET');
        return new Promise((res, rej) => {
            verify(token, secret, async (err, payload) => {
                if (err) {
                    rej(err);
                } else if (typeof payload === 'object') {
                    res(payload.email);
                } else {
                    rej(new Error('[users] verifyToken error: Unknown error'));
                }
            });
        });
    }
}
