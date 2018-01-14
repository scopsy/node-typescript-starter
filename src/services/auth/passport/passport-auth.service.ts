import { Injectable } from '@decorators/di';
import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';
import { IAuthDto } from '../auth.dto';
import { AUTH_STRATEGY } from './passport.service';

@Injectable()
export class PassportAuthService {
    strategyAuthenticate(strategy: AUTH_STRATEGY, req: Request, res: Response, next: NextFunction): Promise<IAuthDto> {
        return new Promise((resolve, reject) => {
            passport.authenticate(strategy, {
                session: false
            }, (err, data) => {
                if (err) return reject(err);

                resolve(data);
            })(req, res, next);
        });
    }
}