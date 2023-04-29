import { Upload } from '@aws-sdk/lib-storage';
import { IDatabase } from '@services/database/types';
import { ILogger } from '@services/logger/types';
import { IS3Client } from '@services/s3-client/types';
import TYPES from '@src/inversify.types';
import busboy from 'busboy';
import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { IParseUploadResponse, IPosts, IUserData } from './types';

@injectable()
export class Posts implements IPosts {
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IDatabase) public database: IDatabase,
        @inject(TYPES.IS3Client) public s3: IS3Client,
    ) {}

    async create(data: IUserData): Promise<IUserData> {
        return await this.database.prismaClient.post.create({
            data: {
                ...data,
                html_preview: data.html.slice(0, 340),
            },
        });
    }

    parseFieldsAndS3Upload(req: Request): Promise<IParseUploadResponse> {
        return new Promise((res, rej) => {
            const bb = busboy({ headers: req.headers });

            let isFile = false;

            const fields: any = {};

            bb.on('file', async (name, file, info) => {
                isFile = true;

                const { filename, mimeType } = info;

                try {
                    const params = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `images/${new Date().toISOString().replace(/\.||-/g, '')}-${filename}`,
                        Body: file,
                    };

                    const upload = new Upload({ client: this.s3.instance, params });
                    const { Location }: any = await upload.done();
                    res({ imageURL: Location, ...fields });
                } catch (error) {
                    rej(error);
                }
            });

            bb.on('field', (name, val, info) => {
                fields[`${name}`] = val;
            });

            bb.on('finish', () => {
                if (!isFile) {
                    res(fields);
                }
                if (isFile) {
                    res({ imageURL: '', ...fields });
                }
            });

            req.pipe(bb);
        });
    }
}
