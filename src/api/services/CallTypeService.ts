import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CallTypeRepository } from '../repositories/CallTypeRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class CallTypeService {

    constructor(
        @OrmRepository() private callTypeRepository: CallTypeRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(options?: any): Promise<any[]> {
        const result = await this.callTypeRepository.find(options);
        this.log.debug(`Find CallType From option: `, result);
        return result;
    }

}
