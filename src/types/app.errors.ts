import { HTTPtatusCodes } from './http';

export const API_ERRORS = {
    GENERAL_ERROR: {
        message: 'Unexpected error occurred',
        status: HTTPtatusCodes.INTERNAL_SERVER_ERROR,
        code: 1000
    },

    // User Errors
    USER_ALREADY_EXISTS: {
        message: 'User already connected under other email.',
        status: HTTPtatusCodes.CONFLICT,
        code: 2000
    }
};
