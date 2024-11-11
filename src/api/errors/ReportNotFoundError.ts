import { HttpError } from 'routing-controllers';

export class ReportNotFoundError extends HttpError {
    constructor() {
        super(404, 'Report Not Found!');
    }
}
