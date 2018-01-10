import { Request, Response } from 'express';
import { User } from '../dal/User';

export interface IAppResponse extends Response {

}

export interface IAppRequest<T = any, S = any> extends Request {
    user?: User;
    body: T;
    query: S;
    locals: any;
}

export interface ErrorPayload {
    status?: number;
    code?: APIErrorCode;
    message: string;
}

export enum APIErrorCode {
    GENERAL_ERROR = 1000,
    UNAUTHORIZED = 1001
}