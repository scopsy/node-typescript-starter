
export class FacebookTokenAuthQueryDto {
    access_token: string;
}

export class LocalLoginDto {
    email: string;
    password: string;
}

export class SignupDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    picture?: string;
}