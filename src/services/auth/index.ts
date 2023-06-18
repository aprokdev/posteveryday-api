import { IENVConfig } from '@services/env-config/types';
import TYPES from '@src/inversify.types';
import { inject, injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import { IAuth } from './types';

@injectable()
export class Auth implements IAuth {
    constructor(@inject(TYPES.IENVConfig) private _env: IENVConfig) {}

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
