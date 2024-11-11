import { HttpError } from 'routing-controllers';

export class TicketHistoryNotFoundError extends HttpError {
    constructor() {
        super(404, 'History of Ticket NOT found!');
    }
}
