import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';
import { Service } from 'ts-express-decorators';
import { AuthDto } from '../auth.dto';
import { AUTH_STRATEGY } from './passport.service';

@Service()
export class PassportAuthService {
    strategyAuthenticate(strategy: AUTH_STRATEGY, req: Request, res: Response, next: NextFunction): Promise<AuthDto> {
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