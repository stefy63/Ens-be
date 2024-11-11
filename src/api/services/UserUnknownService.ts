import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { UserDataTicket } from '../types/UserDataTicket.type';
import { valueOrUndefined } from "../types/ValueOrUndefined";
import { UserUnknownRepository } from "../repositories/UserUnknownRepository";
import { UserUnknown } from "../models/UserUnknown";
import { assign } from "lodash";
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class UserUnknownService {
    constructor(
        @OrmRepository() private userUnknownRepository: UserUnknownRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async createIfNotExists(userDataTicket: UserDataTicket): Promise<valueOrUndefined<UserUnknown>> {
        let userUnknown: valueOrUndefined<UserUnknown> = await this.findWith(userDataTicket);

        if (!userUnknown) {
            const userUnknownPartial: UserDataTicket = await this.userUnknownRepository.save<UserDataTicket>(userDataTicket);
            this.log.debug('Created user unknown: ', userUnknownPartial);
            userUnknown = await this.findWith(userUnknownPartial);
        }

        this.log.debug('User unkown:', userDataTicket);
        return userUnknown;
    }

    public async findWith(userDataTicket: UserDataTicket): Promise<valueOrUndefined<UserUnknown>> {
        this.log.debug('Search user-unknown with filter: ', userDataTicket);
        return await this.userUnknownRepository.findOne({
            where: assign({}, userDataTicket),
        });
    }
}
