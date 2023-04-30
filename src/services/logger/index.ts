import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { ILogger } from './types';

@injectable()
export class LoggerService implements ILogger {
    private _logger: ILogger;

    constructor() {
        this._logger = new Logger({
            type: 'pretty',
            prettyLogTemplate: '{{dateIsoStr}}  {{logLevelName}}: ',
            prettyLogStyles: {
                logLevelName: {
                    '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
                    INFO: ['bold', 'blue'],
                    WARN: ['bold', 'yellow'],
                    ERROR: ['bold', 'red'],
                },
                dateIsoStr: 'black',
            },
        });
    }

    public info(...args: unknown[]): void {
        this._logger.info(...args);
    }

    public error(...args: unknown[]): void {
        this._logger.error(...args);
    }

    public warn(...args: unknown[]): void {
        this._logger.warn(...args);
    }
}
