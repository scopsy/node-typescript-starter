import { JsonProperty } from '@tsed/common';
import { AuthToken } from '../../dal/User';

export interface IAuthProviderProfileDto {
    firstName: string;
    lastName: string;
    picture?: string;
    email: string;
    password?: string;

    facebook?: string;
    tokens?: AuthToken[];
}

export class AuthDto {
    @JsonProperty()
    token: string;
    // Time to expiration specified in EPOC ms
    @JsonProperty()
    expires: string;
}
