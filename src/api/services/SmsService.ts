import { Service } from "typedi";
import { SmsManagerRequest } from '../controllers/requests/SmsManagerRequest';
import { Ticket } from "../models/Ticket";
import { valueOrUndefined } from "src/api/types/ValueOrUndefined";
import { TicketService } from "./TicketService";
import { TicketHistoryService } from "./TicketHistoryService";
import { TicketHistory } from '../models/TicketHistory';
import { Services } from "../enums/TicketServices.enum";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { env } from "../../core/env";
import { TicketStatuses } from "../enums/TicketStatuses.enum";
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class SmsService {
    constructor(
        private ticketService: TicketService,
        private ticketHistoryService: TicketHistoryService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async createSms(sms: SmsManagerRequest, serviceOpened: boolean): Promise<valueOrUndefined<Ticket>> {
        
        let ticket: Ticket = new Ticket();
        ticket.id_service = Services.SMS;

        let ticketInsert: valueOrUndefined<Ticket> = await this.ticketService.create(ticket, { phone: sms.orig });
        if (ticketInsert) {
            const ticketHistory: TicketHistory = new TicketHistory();
            ticketHistory.id_type = HistoryTypes.INITIAL;
            ticketHistory.action = `Sms da: ${sms.orig}`;
            ticketHistory.id_ticket = ticketInsert.id;
            await this.ticketHistoryService.create(ticketHistory);

            /// AUTORESPONDER MESSAGE
            let autoresponderTicketHistory: TicketHistory = new TicketHistory();
            autoresponderTicketHistory.id_type = HistoryTypes.AUTORESPONDER;
            autoresponderTicketHistory.id_ticket = ticketInsert.id;
            autoresponderTicketHistory.action = (serviceOpened) ?
                env.autoresponder.serviceAvailable :
                env.autoresponder.serviceUnavailable;
            await this.ticketHistoryService.create(autoresponderTicketHistory);

            if (!serviceOpened) {
                ticketInsert.id_status = TicketStatuses.UNAVAILABLE;
                await this.ticketService.update(ticketInsert);
            }

        }
        this.log.debug('Create new SMS ticket: ', ticketInsert);
        return ticketInsert;
    }
}
