import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { DefaultDialogRepository } from '../repositories/DefaultDialogRepository';
import { DefaultDialog } from '../models/DefaultDialog';
import { Logger, LoggerInterface } from '../../decorators/Logger';


@Service()
export class DefaultDialogService {

    constructor(
        @OrmRepository() private defaultDialogRepository: DefaultDialogRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(options?: any): Promise<DefaultDialog[]> {
        const result = await this.defaultDialogRepository.find(options);
        this.log.debug(`Find DefaultDialog From option: `, result);
        return result;
    }

}
