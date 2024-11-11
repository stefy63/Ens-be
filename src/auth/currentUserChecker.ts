import { Action } from 'routing-controllers';
import { Logger } from '../core/Logger';
import { TokenInfoInterface } from './TokenInfoInterface';
import { User } from '../api/models/User';


// export function currentUserChecker(connection: Connection): (action: Action) => Promise<Operator | undefined> {
export function currentUserChecker(): (action: Action) => Promise<TokenInfoInterface<User>> {
    const log = new Logger(__filename);

    return async function innerCurrentUserChecker(action: Action): Promise<TokenInfoInterface<User>> {
        const grant: TokenInfoInterface<User> = action.request.tokeninfo;
        log.info(`Current user is ${grant ? JSON.stringify((grant.detail as User).id) : 'undefined'}`);
        return grant;
    };
}

