import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {
    constructor() {
        super(501, 'Impossible to find user.');
    }
}

// tslint:disable-next-line:max-classes-per-file
export class UserNotCreatedError extends HttpError {
    constructor() {
        super(501, 'Impossible to create user.');
    }
}

// tslint:disable-next-line:max-classes-per-file
export class UserNotUpdatedError extends HttpError {
    constructor() {
        super(501, 'Impossible to update user.');
    }
}

// tslint:disable-next-line:max-classes-per-file
export class UserPaaswordNotUpdatedError extends HttpError {
    constructor() {
        super(501, 'Impossible to update user password.');
    }
}
