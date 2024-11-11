import { Service } from "typedi";
import { Ticket } from "../models/Ticket";
import { valueOrUndefined } from "src/api/types/ValueOrUndefined";
import { TicketService } from "./TicketService";
import { TicketHistoryService } from "./TicketHistoryService";
import { TicketHistory } from '../models/TicketHistory';
import { Services } from "../enums/TicketServices.enum";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { TicketStatuses } from "../enums/TicketStatuses.enum";
import { env } from "../../core/env";
import { TelegramRequest } from '../controllers/requests/TelegramRequest';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class TelegramService {
    constructor(
        private ticketService: TicketService,
        private ticketHistoryService: TicketHistoryService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async create(request: TelegramRequest, serviceOpened: boolean): Promise<valueOrUndefined<Ticket>> {
        let ticket: Ticket = new Ticket();
        ticket.id_service = Services.TELEGRAM;

        let ticketInsert: valueOrUndefined<Ticket> = await this.ticketService.create(ticket, { phone: request.phone });
        if (ticketInsert) {
            let ticketHistory: TicketHistory = new TicketHistory();
            ticketHistory.id_type = HistoryTypes.INITIAL;
            ticketHistory.id_ticket = ticketInsert.id;
            ticketHistory.action = `[Telegram] Messaggio da: ${request.phone}`;
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
        this.log.debug('Create new Telegram ticket: ', ticketInsert);

        return ticketInsert;
    }
}
