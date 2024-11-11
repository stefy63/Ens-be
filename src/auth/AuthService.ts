import * as express from 'express';
import { Service, Require } from 'typedi';
import { TokenInfoInterface } from './TokenInfoInterface';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { UnauthorizedError } from 'routing-controllers';
import { User } from '../api/models/User';
import { RedisStore } from "../api/utils/RedisStore";
import * as moment from "moment";
import { TokenExpiredError } from '../api/errors/TokenExpiredError';

@Service("AuthService")
export class AuthService {

    constructor(
        @Require('request') r: any,
        @Logger(__filename) private log: LoggerInterface,
        private redisStore: RedisStore
    ) { }

    public parseTokenFromRequest(req: express.Request): string | undefined {
        const authorization = req.header('authorization');

        // Retrieve the token form the Authorization header
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            this.log.info('Token provided by the client');
            return authorization.split(' ')[1];
        }

        this.log.info('No Token provided by the client');
        return undefined;
    }

    public async getTokenInfo(token: string): Promise<TokenInfoInterface<User>> {
        const redisKeys: string[] = await this.redisStore.keys(`ermes__authentication__*__${token}`);
        if (redisKeys.length === 0) {
            throw new UnauthorizedError('No user found with token: ' + token);
        } else if (redisKeys.length > 1) {
            throw new UnauthorizedError('Multiple user founded with same token: ' + token);
        }

        return this.retrieveUserDetail(redisKeys[0]);
    }

    public async getTokenInfoFor(userId: number): Promise<TokenInfoInterface<User>> {
        const redisKeys: string[] = await this.redisStore.keys(`ermes__authentication__${userId}__*`);
        if (redisKeys.length === 0) {
            throw new UnauthorizedError('No user found with id: ' + userId);
        } else if (redisKeys.length > 1) {
            throw new UnauthorizedError('Multiple user founded with same id: ' + userId);
        }

        return this.retrieveUserDetail(redisKeys[0]);
    }


    public async saveUserContext(user: User, token: string): Promise<void> {
        await this.clearContextFor(user);
        await this.redisStore.save(`ermes__authentication__${user.id}__${token}`, user);
        this.log.debug(`Save redis for the user ${user.id}`);
    }

    public async clearContextFor(user: User): Promise<void> {
        const redisKeys: string[] = await this.redisStore.keys(`ermes__authentication__${user.id}__*`);
        if (redisKeys.length > 0) {
            await this.redisStore.del(...redisKeys);
        }
        this.log.debug(`Clear redis for the user ${user.id}`);
    }

    private async retrieveUserDetail(redisKey: string): Promise<TokenInfoInterface<User>> {
        const userDetail: User = await this.redisStore.get<User>(redisKey);
        if (moment().isAfter(userDetail.token.token_expire_date)) {
            this.clearContextFor(userDetail);
            throw new TokenExpiredError();
        }
        return { detail: userDetail };
    }
}
