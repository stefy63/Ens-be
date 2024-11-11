import * as nock from 'nock';
import { Operator } from '../../../src/api/models/Operator';
import { env } from '../../../src/core/env';


export const fakeAuthenticationForUser = (user: Operator, persist = false): nock.Scope => {
    const scope = nock(env.auth.route)
        .post('')
        .reply(200, {
            user_id: `auth0|${user.email}`,
        });
    if (persist) {
        scope.persist();
    }
    return scope;
};
