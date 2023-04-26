import { HTTPError422 } from '@errors/index';
import crypto from 'crypto';
import { IRegisterUserBody, IUserEntity, hashedPasswordData } from './types';

export function validatePassword(password: string, hash: string, salt: string): boolean {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

export function genPassword(password: string): hashedPasswordData {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

export class UserEntity implements IUserEntity {
    public email: string;
    public first_name: string;
    public last_name: string;
    public hash: string;
    public salt: string;
    public role: 'user' | 'admin';
    public image: string;

    constructor({ email, first_name, last_name, password }: IRegisterUserBody) {
        if (!email || !first_name || !last_name || !password) {
            throw new HTTPError422(
                'body should contain email, first_name, last_name, password fields',
            );
        }

        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.salt = crypto.randomBytes(32).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
        this.role = 'user';
        this.image = '';
    }
}
