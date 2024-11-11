import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TicketHistoryTypeRepository } from '../repositories/TicketHistoryTypeRepository';
import { TicketHistoryType } from '../models/TicketHistoryType';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class TicketHistoryTypeService {

    constructor(
        @OrmRepository() private ticketHistoryTypeRepository: TicketHistoryTypeRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(options?: any): Promise<TicketHistoryType[]> {
        const finded = await this.ticketHistoryTypeRepository.find(options);
        this.log.debug('Find Histry Type: ', finded);
        return finded;
    }

}
