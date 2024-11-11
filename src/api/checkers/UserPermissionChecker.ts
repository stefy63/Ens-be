import { User } from "../models/User";
import { chain, isEmpty } from "lodash";
import { Permissions } from "../models/Permissions";
import { isArray } from 'util';

export class UserPermissionChecker {
    public static hasPermission(user: User, permissions: string[] | string): boolean {
        if (!user.role) {
            return false;
        }

        permissions = isArray(permissions) ? permissions : [permissions];
        return !isEmpty(chain(user.role.permissions)
            .map((permission: Permissions) => permission.action)
            .intersection(permissions)
            .value());
    }
}
