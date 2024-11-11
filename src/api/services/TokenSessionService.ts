import { Service } from 'typedi';
import { LoggerInterface } from '../../core/LoggerInterface';
import { Logger } from '../../decorators/Logger';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TokenSessionRepository } from '../repositories/TokenSessionRepository';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { TokenSession } from '../models/TokenSession';
import { User } from '../../api/models/User';
import { TokenCalculator } from '../token/TokenCalculator';
import * as moment from 'moment';


@Service()
export class TokenSessionService {

    constructor(
        @OrmRepository() private tokenSessionRepository: TokenSessionRepository,
        @Logger(__filename) private log: LoggerInterface,
        private tokenCalculator: TokenCalculator
    ) { }

    public find(options?: any): Promise<valueOrUndefined<TokenSession[]>> {
        this.log.debug('Find all TokenSessione from filter: ', options);
        return this.tokenSessionRepository.find(options);
    }

    public findOne(options: any): Promise<valueOrUndefined<TokenSession>> {
        this.log.debug('Find one TokenSessione from option: ', options);
        return this.tokenSessionRepository.findOne(options);
    }

    public async create(tokenSession: TokenSession): Promise<valueOrUndefined<TokenSession>> {
        this.log.debug('create a TokenSession: ', tokenSession);

        return this.tokenSessionRepository.save(tokenSession);
    }

    public async delete(tokenSession: TokenSession): Promise<void> {
        this.log.debug('delete a TokenSessione: ', tokenSession);
        this.tokenSessionRepository.delete(tokenSession.id);
    }

    public async generate(user: User): Promise<valueOrUndefined<TokenSession>> {
        const token_session = new TokenSession();
        token_session.id_user = user.id;

        const tokenFind: valueOrUndefined<TokenSession> = await this.findOne(token_session);
        token_session.id = (!tokenFind) ? 0 : tokenFind.id;
        token_session.token_session = await this.tokenCalculator.getAccesToken();
        token_session.token_expire_date = moment().add(process.env['APP_VALID_TOKEN_HOUR'], 'hour').toDate();
        return await this.create(token_session);
    }


}

