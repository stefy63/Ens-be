import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CallResultRepository } from '../repositories/CallResultRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';


@Service()
export class CallResultService {

    constructor(
        @OrmRepository() private callResultRepository: CallResultRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(options?: any): Promise<any[]> {
        const result = await this.callResultRepository.find(options);
        this.log.debug(`Find CallResult From option: `, result);
        return result;
    }

}
