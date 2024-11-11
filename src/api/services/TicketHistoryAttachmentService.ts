import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { TicketHistoryAttachmentRepository } from '../repositories/TicketHistoryAttachmentRepository';
import { TicketHistoryAttachment } from '../models/TicketHistoryAttachments';
import { TicketHistoryService } from "./TicketHistoryService";
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class TicketHistoryAttachmentService {
    constructor(
        @OrmRepository() private ticketHistoryAtatchmentRepository: TicketHistoryAttachmentRepository,
        private ticketHistoryService: TicketHistoryService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    public async create(id_ticket: number, id_history: number, path: string, name: string): Promise<valueOrUndefined<TicketHistoryAttachment>> {
        const ticketHistoryAttachments: TicketHistoryAttachment = new TicketHistoryAttachment();
        ticketHistoryAttachments.id_ticket_history = id_history;
        ticketHistoryAttachments.path = path;
        ticketHistoryAttachments.name = name;

        const saveTicketHistoryAttachment: TicketHistoryAttachment = await this.ticketHistoryAtatchmentRepository.save(ticketHistoryAttachments);
        this.ticketHistoryService.notify(id_ticket);
        this.log.debug('Create new history Attachment: ', saveTicketHistoryAttachment);
        return saveTicketHistoryAttachment;
    }
}
