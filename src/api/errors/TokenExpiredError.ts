import { HttpError } from 'routing-controllers';

export class TokenExpiredError extends HttpError {
    constructor() {
        super(401, 'Token Expired!');
    }
}
