import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { TicketStatuses } from '../enums/TicketStatuses.enum';
import { Ticket } from '../models/Ticket';
import { TicketHistory } from '../models/TicketHistory';
import { TicketHistoryRepository } from '../repositories/TicketHistoryRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import { SenderDispatcher } from "../senders/SenderDispatcher";
import { events } from '../subscribers/events';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { TicketService } from './TicketService';

@Service()
export class TicketHistoryService {
    constructor(
        @OrmRepository() private ticketHistoryRepository: TicketHistoryRepository,
        @OrmRepository() private ticketRepository: TicketRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface,
        private senderDispatcher: SenderDispatcher,
        private ticketService: TicketService
    ) {
    }

    public getUnreadedMessages(idOperator: number): Promise<number> {
        return this.ticketHistoryRepository.createQueryBuilder('ticketHistory')
            .leftJoinAndSelect('ticketHistory.ticket', 'ticket')
            .where('deleted = 0')
            .andWhere('readed = 0')
            .andWhere('ticket.id_status=:status', {status: TicketStatuses.ONLINE})
            .andWhere('id_type=:type', {type: HistoryTypes.USER})
            .andWhere('ticket.id_operator=:operator', {operator: idOperator})
            .getCount();
    }

    public async create(history: TicketHistory): Promise<valueOrUndefined<TicketHistory>> {
        const saveTicketHistory: TicketHistory = await this.ticketHistoryRepository.save(history);
        const newTicket: Ticket = await this.ticketService.findOneWith(saveTicketHistory.id_ticket, ['user', 'userUnknown', 'historys']) as Ticket;

        await this.senderDispatcher.dispatch(newTicket, saveTicketHistory);
        this.eventDispatcher.dispatch(events.ticketHistory.create, newTicket);
        this.log.debug('Create history by ticket', saveTicketHistory);
        return saveTicketHistory;
    }

    public async updateReaded(id: number): Promise<void> {
        const newTicket: Ticket = await this.ticketService.findOneWith(id) as Ticket;
        this.eventDispatcher.dispatch(events.ticketHistory.updated, newTicket);
        const updatedTicket = await this.ticketHistoryRepository.update({ id_ticket: id }, { readed: 1 });
        this.log.debug('Update history by ticket', updatedTicket);
    }

    public async delete(history: TicketHistory): Promise<void> {
        const deleteTicket = await this.ticketHistoryRepository.delete(history);
        this.log.debug('Delete history by ticket', deleteTicket);
    }

    public async notify(id: number): Promise<void> {
        const newTicket: valueOrUndefined<Ticket> = await this.ticketRepository.findOne(id);
        this.eventDispatcher.dispatch(events.ticketHistory.create, newTicket);
    }

}
