import { HTTPStatusCodes } from './http';

export const API_ERRORS = {
    GENERAL_ERROR: {
        message: 'Unexpected error occurred',
        status: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
        code: 1000
    },
    UNAUTHORIZED: {
        message: 'Unauthorized',
        status: HTTPStatusCodes.UNAUTHORIZED,
        code: 1001
    },
    EXPIRED_TOKEN: {
        message: 'Expired token provided',
        status: HTTPStatusCodes.UNAUTHORIZED,
        code: 1002
    },
    VALIDATION_ERROR: {
        message: 'Data validation error occurred',
        status: HTTPStatusCodes.BAD_REQUEST,
        code: 1003
    },

    // User Errors
    USER_ALREADY_EXISTS: {
        message: 'User already exists.',
        status: HTTPStatusCodes.CONFLICT,
        code: 2000
    },
    USER_NOT_FOUND: {
        message: 'User not found.',
        status: HTTPStatusCodes.NOT_FOUND,
        code: 2001
    },
    USER_WRONG_CREDENTIALS: {
        message: 'Wrong credentials provided',
        status: HTTPStatusCodes.UNAUTHORIZED,
        code: 2002
    },
};
