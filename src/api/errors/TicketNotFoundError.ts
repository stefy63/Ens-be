import { HttpError } from 'routing-controllers';

export class TicketNotFoundError extends HttpError {
    constructor() {
        super(404, 'Ticket NOT found!');
    }
}
