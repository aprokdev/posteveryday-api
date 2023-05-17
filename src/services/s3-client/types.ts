import { S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export interface IS3Client {
    instance: S3Client;
    uploadImage: (file: Readable, filename: string) => Promise<string>;
    deleteS3File: (key: string) => Promise<boolean>;
    getS3KeyFromURL: (url: string) => string;
}
