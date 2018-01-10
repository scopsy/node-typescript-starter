import { IAuthToken } from '../../dal/User';

export interface IAuthProviderProfileDto {
    firstName: string;
    lastName: string;
    picture?: string;
    email: string;
    password?: string;

    facebook?: string;
    tokens?: IAuthToken[];
}

export interface IAuthDto {
    token: string;
    // Time to expiration specified in EPOC ms
    expires: string;
}
