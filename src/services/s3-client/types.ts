import { S3Client } from '@aws-sdk/client-s3';
import { IENVConfig } from '../env-config/types';
import { ILogger } from '../logger/types';

export interface IS3Client {
    instance: S3Client;
    logger: ILogger;
    env: IENVConfig;
}
