import { S3Client } from '@aws-sdk/client-s3';

export interface IS3Client {
    instance: S3Client;
}
