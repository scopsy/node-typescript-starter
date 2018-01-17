import { HTTPtatusCodes } from './http';

export const API_ERRORS = {
    GENERAL_ERROR: {
        message: 'Unexpected error occurred',
        status: HTTPtatusCodes.INTERNAL_SERVER_ERROR,
        code: 1000
    },
    UNAUTHORIZED: {
        message: 'Unauthorized',
        status: HTTPtatusCodes.UNAUTHORIZED,
        code: 1001
    },
    EXPIRED_TOKEN: {
        message: 'Expired token provided',
        status: HTTPtatusCodes.UNAUTHORIZED,
        code: 1002
    },
    VALIDATION_ERROR: {
        message: 'Data validation error occurred',
        status: HTTPtatusCodes.BAD_REQUEST,
        code: 1003
    },

    // User Errors
    USER_ALREADY_EXISTS: {
        message: 'User already exists.',
        status: HTTPtatusCodes.CONFLICT,
        code: 2000
    },
    USER_NOT_FOUND: {
        message: 'User not found.',
        status: HTTPtatusCodes.NOT_FOUND,
        code: 2001
    },
    USER_WRONG_CREDENTIALS: {
        message: 'Wrong credentials provided',
        status: HTTPtatusCodes.UNAUTHORIZED,
        code: 2002
    },
};
