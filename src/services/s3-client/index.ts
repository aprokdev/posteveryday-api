import { S3Client as Client } from '@aws-sdk/client-s3';
import TYPES from '@src/inversify.types';
import { inject, injectable } from 'inversify';
import { IENVConfig } from '../env-config/types';
import { ILogger } from '../logger/types';
import { IS3Client } from './types';

@injectable()
export class S3Client implements IS3Client {
    public instance: Client;
    constructor(@inject(TYPES.IENVConfig) private _env: IENVConfig) {
        this.instance = new Client({
            region: 'ca-central-1',
            credentials: {
                accessKeyId: this._env.instance.AWS_ACCESS_KEY_ID,
                secretAccessKey: this._env.instance.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
}
