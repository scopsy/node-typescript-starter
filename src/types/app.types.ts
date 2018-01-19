import { Request, Response } from 'express';
import { UserInstance } from '../dal/User';

export interface IAppResponse extends Response {

}

export interface IAppRequest<T = any, S = any> extends Request {
    user?: UserInstance;
    body: T;
    query: S;
    locals: any;
}