import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TicketStatusRepository } from '../repositories/TicketStatusRepository';
import { TicketStatus } from '../models/TicketStatus';
import { Logger, LoggerInterface } from '../../decorators/Logger';


@Service()
export class TicketStatusService {

    constructor(
        @OrmRepository() private ticketStatusRepository: TicketStatusRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(options?: any): Promise<TicketStatus[]> {
        this.log.debug('Find Status from options: ', options);
        return this.ticketStatusRepository.find(options);
    }

}
