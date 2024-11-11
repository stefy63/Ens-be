import { User } from '../models/User';

export interface UserRequest {
    user: User;
    noSendMail?: boolean;
}
