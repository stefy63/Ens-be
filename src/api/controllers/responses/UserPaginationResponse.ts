import { User } from '../../models/User';
import { valueOrUndefined } from '../../types/ValueOrUndefined';
import { PaginationResponse } from "./PaginationResponse";

export class UserPaginationResponse {
    public page: PaginationResponse;
    public data: valueOrUndefined<User[]>;
}
