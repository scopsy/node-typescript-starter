export interface IAuthProviderProfileDto {
    firstName: string;
    lastName: string;
    picture?: string;
    id: string;
    email: string;
}

export interface IAuthDto {
    token: string;
    // Time to expiration specified in EPOC ms
    expiresIn: string;
}
