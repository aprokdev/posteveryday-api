import { NextFunction, Request, Response } from 'express';

export interface IMIddleware {
    execute: (req: Request, res: Response, next: NextFunction) => void;
}
