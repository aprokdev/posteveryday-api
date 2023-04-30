import { DotenvParseOutput } from 'dotenv';

export interface IENVConfig {
    instance: DotenvParseOutput;
    get: (key: string) => string;
}
