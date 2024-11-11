import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { UserDataRepository } from "../repositories/UserDataRepository";
import { UserDataTicket } from '../types/UserDataTicket.type';
import { valueOrUndefined } from "../types/ValueOrUndefined";
import { User } from '../models/User';
import { assign } from "nodemailer/lib/shared";
import { UserData } from "../models/UserData";
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class UserDataService {
    constructor(
        @OrmRepository() private userDataRepository: UserDataRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async userWith(userDataTicket: UserDataTicket): Promise<valueOrUndefined<User>> {
        const userData: valueOrUndefined<UserData> = await this.userDataRepository.findOne({
            relations: ["user"],
            where: assign({}, userDataTicket),
        });
        this.log.debug('Find User with userData: ', userDataTicket);
        return (!userData) ? undefined : userData.user;
    }

    public find(options?: any): Promise<valueOrUndefined<UserData>> {
        this.log.debug('Find One UserData from options: ', options);
        return this.userDataRepository.findOne(options);
    }

    public findOneById(id: any): Promise<valueOrUndefined<UserData>> {
        this.log.debug('Find one UserData by ID: ', id);
        return this.userDataRepository.findOne(id);
    }

    public save(newUserData: UserData): Promise<UserData> {
        return this.userDataRepository.save(newUserData);
    }

    public async update(userData: UserData): Promise<valueOrUndefined<UserData>> {
        this.log.debug('Update a User Data: ', userData);
        return await this.userDataRepository.save(userData);
    }


}
