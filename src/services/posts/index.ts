import { Upload } from '@aws-sdk/lib-storage';
import { IDatabase } from '@services/database/types';
import { IENVConfig } from '@services/env-config/types';
import { ILogger } from '@services/logger/types';
import { IS3Client } from '@services/s3-client/types';
import TYPES from '@src/inversify.types';
import busboy from 'busboy';
import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { IParseUploadResponse, IPostData, IPosts } from './types';

@injectable()
export class Posts implements IPosts {
    constructor(
        @inject(TYPES.IDatabase) private _db: IDatabase,
        @inject(TYPES.IS3Client) private _s3: IS3Client,
        @inject(TYPES.IENVConfig) private _env: IENVConfig,
    ) {}

    async create(req: Request): Promise<void> {
        // const { title, html, imageURL: image } = await this._parseFieldsAndS3Upload(req);
        // return await this._db.instance.post.create({
        //     data: {
        //         title,
        //         html,
        //         html_preview: html.slice(0, 340),
        //         image,
        //         // author_id: Number(session.id),
        //         // author_firstname: session.first_name,
        //         // author_lastname: session.last_name,
        //     },
        // });
    }

    private _parseFieldsAndS3Upload(req: Request): Promise<IParseUploadResponse> {
        return new Promise((res, rej) => {
            const bb = busboy({ headers: req.headers });

            let isFile = false;

            const fields: any = {};

            bb.on('file', async (name, file, info) => {
                isFile = true;

                const { filename, mimeType } = info;

                try {
                    const params = {
                        Bucket: this._env.get('AWS_S3_BUCKET_NAME'),
                        Key: `images/${new Date().toISOString().replace(/\.||-/g, '')}-${filename}`,
                        Body: file,
                    };

                    const upload = new Upload({ client: this._s3.instance, params });
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
