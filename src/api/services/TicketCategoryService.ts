import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TicketCategoryRepository } from '../repositories/TicketCategoryRepository';
import { TicketCategory } from '../models/TicketCategory';
import { Logger, LoggerInterface } from '../../decorators/Logger';


@Service()
export class TicketCategoryService {

    constructor(
        @OrmRepository() private ticketCategoryRepository: TicketCategoryRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(options?: any): Promise<TicketCategory[]> {
        const category = await this.ticketCategoryRepository.find(options);
        this.log.debug('Find category: ', category);
        return category;
    }

}
