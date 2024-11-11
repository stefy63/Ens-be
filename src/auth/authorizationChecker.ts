import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';
import { AuthService } from './AuthService';
import { Logger } from '../core/Logger';
import { isEmpty } from "lodash";
import { UserPermissionChecker } from "../api/checkers/UserPermissionChecker";


export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const log = new Logger(__filename);
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
        const token = await authService.parseTokenFromRequest(action.request);
        if (token === undefined) {
            log.warn('No token given');
            return false;
        }

        let isAuthenticated: boolean;
        try {
            action.request.tokeninfo = await authService.getTokenInfo(token);
            isAuthenticated = true;
        } catch (e) {
            log.warn(e);
            isAuthenticated = false;
        }
        if (isEmpty(roles) || !isAuthenticated) {
            return isAuthenticated;
        } else {
            return UserPermissionChecker.hasPermission(action.request.tokeninfo.detail, roles);
        }
    };
}
