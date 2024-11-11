import { HttpError } from 'routing-controllers';

export class QueueEmptyError extends HttpError {
    constructor() {
        super(404, 'Queue empty!');
    }
}
