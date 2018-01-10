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

