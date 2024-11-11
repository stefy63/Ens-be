import { Service } from 'typedi';
import { RemoveOptions } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PaginationRequest } from '../controllers/requests/PaginationRequest';
import { User } from '../models/User';
import { UserData } from "../models/UserData";
import { UserRepository } from '../repositories/UserRepository';
import { UserChangePasswordType } from '../types/UserChangePassword.type';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { UserDataService } from "./UserDataService";

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @Logger(__filename) private log: LoggerInterface,
        private userDataService: UserDataService
    ) { }

    public find(options?: any): Promise<valueOrUndefined<User[]>> {
        this.log.debug('Find all User from options: ', options);
        return this.userRepository.find(options);
    }

    public findOne(options?: any): Promise<valueOrUndefined<User>> {
        this.log.debug('Find all User from options: ', options);
        return this.userRepository.findOne(options);
    }

    public findOneById(id: any): Promise<valueOrUndefined<User>> {
        this.log.debug('Find one User by ID: ', id);
        return this.userRepository.findOne(id, {relations: ["token"]});
    }

    public findOneByUserOrEmailOrPhone(username: string, email: string, phone: string, id?: number): Promise<valueOrUndefined<User>> {
        this.log.debug('Find One User from username and email: ', username, email);

        let users_finded = this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.userdata', 'userdata')
                .where(`(user.username = :name OR userdata.email = :mail OR userdata.phone = :tel)`, {name: username, mail: email, tel: phone});
        if (!!id) {
            users_finded.andWhere('user.id <> :user_id', {user_id: id});
        }

        return users_finded.getOne();
    }

    public findOperator(filter: string): Promise<valueOrUndefined<any[]>> {
        this.log.debug('Find all Operator by Page and Filter: ');

        const operator_export = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.userdata', 'userdata')
        .leftJoinAndSelect('user.services', 'services')
        .leftJoinAndSelect('user.office', 'office')
        .where(`user.isOperator = 1`);

        if (!!filter) {
            operator_export.andWhere("(`userdata`.`name` LIKE :filter OR\
            `userdata`.`surname` LIKE :filter OR\
            `userdata`.`email` LIKE :filter OR\
            `userdata`.`phone` LIKE :filter OR\
            `user`.`username` LIKE :filter)", {filter: `%${filter}%`});
        }

        return operator_export.getMany();
    }

    public findPagedAndFiltered(page: PaginationRequest): Promise<valueOrUndefined<[User[], number]>> {
        this.log.debug('Find all User by Page and Filter: ', page);

        let result = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userdata', 'userdata');

        result.where(`user.isOperator = :isOperator`, {isOperator: page.onlyOperator ? 1 : 0});
        if (!!page.filter) {
            result.andWhere("(`userdata`.`name` LIKE :filter OR\
            `userdata`.`surname` LIKE :filter OR\
            `userdata`.`email` LIKE :filter OR\
            `userdata`.`phone` LIKE :filter OR\
            `user`.`username` LIKE :filter)", {filter: `%${page.filter}%`});
        }

        if (!page.size) {
            this.log.debug("", result.getQuery());
            return result.getManyAndCount();
        }

        const take: number = page.size || 1;
        result = result.skip(page.pageNumber * take).take(take);
        
        this.log.debug("", result.getQuery());
        return result.getManyAndCount();
    }

    public async create(user: User): Promise<valueOrUndefined<User>> {
        this.log.debug('Create a User: ', user);
        const newUserData = await this.userDataService.update(user.userdata);
        if (!newUserData) {
            throw new Error('userdata is not been updated');
        }

        user.userdata = newUserData as UserData;
        user.date_creation = new Date();

        return await this.userRepository.save(user);
    }

    public changePassword(options: UserChangePasswordType): Promise<valueOrUndefined<User>> {
        this.log.debug('Change Password for User: ', options);
        return Promise.resolve(undefined);
    }

    public async update(user: User): Promise<valueOrUndefined<User>> {
        delete user.token;
        this.log.debug('Update a User: ', user);
        const newUserData = await this.userDataService.update(user.userdata);
        if (!newUserData) {
            throw new Error('userdata is not been updated');
        }

        user.userdata = newUserData as UserData;
        user.date_update = new Date();
        return await this.userRepository.save(user);
    }

    public remove(user: User, options?: RemoveOptions): Promise<valueOrUndefined<User>> {
        this.log.debug('Remove User or Relations where: ', user);
        return this.userRepository.remove(user, options);
    }

    public DeleteAllRelatedService(user: User): Promise<any>  {
        return this.userRepository.createQueryBuilder()
                    .relation('services')
                    .of({id: user.id})
                    .remove(user.services);

    }

    public count(): Promise<number> {
        return this.userRepository.count();
    }

}
