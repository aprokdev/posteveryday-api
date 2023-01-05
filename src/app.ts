import express from 'express';
import { inject, injectable } from 'inversify';
import TYPES from './inversify.types';
import { ILogger } from './services/logger/types';
import { IApp } from './types';

@injectable()
export class App implements IApp {
    private app;
    private port;
    constructor(@inject(TYPES.ILogger) public logger: ILogger) {
        this.app = express();
        this.port = 8000;
    }

    init(): void {
        this.app.listen(this.port, () => {
            this.logger.info(`Server started on port: ${this.port}`);
        });
    }
}
