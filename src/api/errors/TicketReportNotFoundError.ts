import { HttpError } from 'routing-controllers';

export class TicketReportNotFoundError extends HttpError {
    constructor() {
        super(404, 'Report of Ticket NOT found!');
    }
}
