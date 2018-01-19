import { IsEmail, IsNotEmpty as Required, IsOptional, IsUrl, MinLength } from 'class-validator';
import { JsonProperty } from 'ts-express-decorators';

export class FacebookTokenAuthQueryDto {
    access_token: string;
}

export class LocalLoginDto {
    @JsonProperty()
    @IsEmail()
    @Required()
    email: string;

    @JsonProperty()
    @Required()
    @MinLength(6)
    password: string;
}

export class SignupDto {
    @IsEmail()
    @Required()
    @JsonProperty()
    email: string;

    @JsonProperty()
    @Required()
    @MinLength(6)
    password: string;

    @JsonProperty()
    @Required()
    firstName: string;

    @JsonProperty()
    @Required()
    lastName: string;

    @JsonProperty()
    @IsUrl()
    @IsOptional()
    picture?: string;
}