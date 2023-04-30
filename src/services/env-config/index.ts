import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { inject, injectable } from 'inversify';
import TYPES from '../../inversify.types';
import { ILogger } from '../logger/types';
import { IENVConfig } from './types';

@injectable()
export class ENVConfig implements IENVConfig {
    public instance: DotenvParseOutput;
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error("[ConfigService] Can't read .env file");
        } else {
            this.logger.info('[ConfigService] Config has been loaded');
            this.instance = result.parsed as DotenvParseOutput;
        }
    }

    public get(key: string): string {
        return this.instance[key];
    }
}
