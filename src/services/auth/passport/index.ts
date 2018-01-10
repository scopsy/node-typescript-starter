import * as passport from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { Injectable } from '@decorators/di';
import { Application } from 'express';

import { IAppRequest } from '../../../types/app.types';
import { UnexpectedError } from '../../../utils/error/UnexpectedError';
import { AuthService } from '../auth.service';

export const FACEBOOK_TOKEN_STRATEGY = 'facebook-token';
export const JWT_STRATEGY = 'jwt';
export const LOCAL_STRATEGY = 'local';

@Injectable()
export class PassportService {
    constructor(
        private authService: AuthService
    ) {

    }

    initialize(app: Application) {
        app.use(passport.initialize());

        passport.use(JWT_STRATEGY, this.jwtAuthStrategy);
        passport.use(LOCAL_STRATEGY, this.passportLocalStrategy);
        passport.use(FACEBOOK_TOKEN_STRATEGY, this.facebookTokenStrategy);
    }

    private jwtAuthStrategy = new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await this.authService.rehydrateUser(jwt_payload._id);
            if (!user) return done(null, false);

            done(null, user);
        } catch (e) {
            throw new UnexpectedError();
        }
    });

    private passportLocalStrategy = new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req: IAppRequest, email, password, done) => {
        try {
            const auth = await this.authService.authenticateLocal(email, password);

            req.locals = {
                authData: auth
            };

            done(null, auth);
        } catch (e) {
            done(e);
        }
    });

    private facebookTokenStrategy = new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        passReqToCallback: true
    }, async (req: IAppRequest, accessToken, refreshToken, profile, done)  => {
        try {
            const data = {
                facebook: profile.id,
                tokens: [{
                    accessToken,
                    provider: 'facebook'
                }],
                email: profile.emails[0].value,
                picture: profile.photos[0] && profile.photos[0].value,
                lastName: profile.name.familyName,
                firstName: profile.name.givenName
            };

            const auth = await this.authService.authenticateProvider('facebook', profile.id, data);

            req.locals = {
                authData: auth
            };

            done(null, auth);
        } catch (e) {
            done(e);
        }
    });
}
