import * as passport from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as LocalStrategy } from 'passport-local';

import { Injectable } from '@decorators/di';
import { Application } from 'express';

import { IAppRequest } from '../../../types/app.types';
import { AuthService } from '../auth.service';

export enum AUTH_STRATEGY {
    FACEBOOK_TOKEN_STRATEGY = 'facebook-token',
    LOCAL_STRATEGY = 'local'
}

@Injectable()
export class PassportService {
    constructor(
        private authService: AuthService
    ) {

    }

    initialize(app: Application) {
        app.use(passport.initialize());

        passport.use(AUTH_STRATEGY.LOCAL_STRATEGY, this.passportLocalStrategy);
        passport.use(AUTH_STRATEGY.FACEBOOK_TOKEN_STRATEGY, this.facebookTokenStrategy);
    }

    private passportLocalStrategy = new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req: IAppRequest, email, password, done) => {
        try {
            const auth = await this.authService.authenticateLocal(email, password);

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

            const auth = await this.authService.generateProviderToken('facebook', profile.id, data);

            done(null, auth);
        } catch (e) {
            done(e);
        }
    });
}
