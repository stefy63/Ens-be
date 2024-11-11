import { HttpError } from 'routing-controllers';

export class TicketNotCreatedError extends HttpError {
    constructor() {
        super(501, 'Impossible to create new ticket');
    }
}
