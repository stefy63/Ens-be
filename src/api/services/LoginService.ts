import { Service } from 'typedi';
import { UserService } from '../services/UserService';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { TokenSessionService } from './TokenSessionService';
import { User } from "../models/User";
import { Md5 } from 'md5-typescript';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { LoginRequest } from "../controllers/requests/LoginRequest";

@Service()
export class LoginService {

    constructor(
        private userService: UserService,
        private tokenSessionService: TokenSessionService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async perform(request: LoginRequest): Promise<valueOrUndefined<User>> {
        const passwordCrypted: string = Md5.init(request.password);
        const usFind: valueOrUndefined<User> = await this.userService.findOne({
            relations: ["token"],
            where: {
                username: request.username,
                password: passwordCrypted,
            },
        });

        if (!usFind) {
            return undefined;
        }

        delete usFind.password;
        delete usFind.username;

        const token_session = await this.tokenSessionService.generate(usFind);
        if (!token_session) {
            return undefined;
        }
        this.log.debug(`Login Performance for: `, usFind);
        return await this.userService.findOneById(usFind.id);
    }
}
