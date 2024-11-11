import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TicketServiceRepository } from '../repositories/TicketServiceRepository';
import { TicketService } from '../models/TicketService';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { valueOrUndefined } from '../types/ValueOrUndefined';


@Service()
export class TicketServiceService {

    constructor(
        @OrmRepository() private ticketServiceRepository: TicketServiceRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(options?: any): Promise<TicketService[]> {
        this.log.debug('Find Service from options: ', options);
        return this.ticketServiceRepository.find(options);
    }

    public async findById(id: number): Promise<valueOrUndefined<TicketService>> {
        this.log.debug('Find Service from ID: ', id);
        const item = await this.ticketServiceRepository.findOne(id);
        if (!item) {
            return undefined;
        }
        return item;
    }

    public async update(service: TicketService): Promise<valueOrUndefined<TicketService>> {
        const item = await this.findById(service.id);
        if (!item) {
            return undefined;
        }
        await this.ticketServiceRepository.save(service);
        this.log.debug('Update Service: ', service);
        return service;
    }


}
