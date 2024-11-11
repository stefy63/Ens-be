import { HttpError } from 'routing-controllers';

export class WrongPasswordError extends HttpError {
    constructor() {
        super(501, 'ERROR_WRONG_OLD_PASSWORD');
    }
}
