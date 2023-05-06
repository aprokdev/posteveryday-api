import { S3Client as Client } from '@aws-sdk/client-s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import TYPES from '@src/inversify.types';
import { inject, injectable } from 'inversify';
import { Readable } from 'stream';
import { IENVConfig } from '../env-config/types';
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

    public async uploadImage(file: Readable, filename: string): Promise<string> {
        const params = {
            Bucket: this._env.get('AWS_S3_BUCKET_NAME'),
            Key: `images/${new Date().toISOString().replace(/\.|:|-/g, '')}-${filename}`,
            Body: file,
        };
        const upload = new Upload({ client: this.instance, params });
        const { Location }: any = await upload.done();
        return Location;
    }

    public async deleteS3File(key: string): Promise<boolean> {
        const command = new DeleteObjectCommand({
            Bucket: this._env.get('AWS_S3_BUCKET_NAME'),
            Key: key,
        });
        await this.instance.send(command);
        return true;
    }

    public getS3KeyFromLink(link: string): string {
        const imageURL = new URL(link);
        return imageURL.pathname.slice(1); // key: '/images/filename.jpg' => 'images/filename.jpg'
    }
}
