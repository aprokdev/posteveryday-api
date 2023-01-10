import { DotenvParseOutput } from 'dotenv';

export interface IENVConfig {
    config: DotenvParseOutput;
    get: (key: string) => string | undefined;
}
