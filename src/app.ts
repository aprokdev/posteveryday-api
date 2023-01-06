import express from 'express';
import { inject, injectable } from 'inversify';
import TYPES from './inversify.types';
import { IErrorFilter } from './services/error-filter/types';
import { ILogger } from './services/logger/types';
import { IUserController } from './services/user-controller/types';
import { IApp } from './types';

@injectable()
export class App implements IApp {
    private app;
    private port;
    constructor(
        @inject(TYPES.ILogger) public logger: ILogger,
        @inject(TYPES.IErrorFilter) public errorFilter: IErrorFilter,
        @inject(TYPES.IUserController) public userController: IUserController,
    ) {
        this.app = express();
        this.port = 8000;
    }

    applyMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(this.errorFilter.execute.bind(this.errorFilter));
    }

    applyControllers(): void {
        this.app.use('/user', this.userController.router);
    }

    init(): void {
        this.app.listen(this.port, () => {
            this.logger.info(`Server has been started on https://localhost:${this.port}`);
        });
        this.applyMiddlewares();
        this.applyControllers();
    }
}
