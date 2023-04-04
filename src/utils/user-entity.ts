import crypto from 'crypto';

export function validatePassword(password: string, hash: string, salt: string): boolean {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

export type genPassword = {
    salt: string;
    hash: string;
};

export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    hash: string;
    salt: string;
    role: string;
    image: string;
}

export function genPassword(password: string): genPassword {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
}
