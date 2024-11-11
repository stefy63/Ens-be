import { JsonController, Post, Body } from "routing-controllers";
import { valueOrUndefined } from "../types/ValueOrUndefined";
import { Ticket } from "../models/Ticket";
import { TicketService } from "../services/TicketService";
import { TicketHistory } from "../models/TicketHistory";
import { TicketHistoryService } from "../services/TicketHistoryService";
import { AttachmentEmailRequest } from "./requests/EmailManagerRequest";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { ServiceCalendarService } from '../services/ServiceCalendarService';
import { Services } from "../enums/TicketServices.enum";
import { UserDataTicket } from "../types/UserDataTicket.type";
import { TicketHistoryAttachmentService } from '../services/TicketHistoryAttachmentService';
import { forEach, assign } from "lodash";
import { TelegramRequest } from "./requests/TelegramRequest";
import { TelegramService } from '../services/TelegramService';
import { LoggerInterface, Logger } from '../../decorators/Logger';
import { ValidatorApplier } from "../validators/ValidatorApplier";
import { ResponseSchema } from 'routing-controllers-openapi';

@JsonController("/telegram")
export class TelegramController {
    constructor(
        private telegramService: TelegramService,
        private ticketService: TicketService,
        private ticketHistoryService: TicketHistoryService,
        private serviceCalendarService: ServiceCalendarService,
        private ticketHistoryAttachmentService: TicketHistoryAttachmentService,
        private validatorApplier: ValidatorApplier,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Post()    
    @ResponseSchema(Ticket)
    public async create(@Body() telegramRequest: TelegramRequest): Promise<valueOrUndefined<Ticket>> {
        telegramRequest = assign(new TelegramRequest(), telegramRequest);
        await this.validatorApplier.apply<TelegramRequest>(telegramRequest);

        const serviceOpened: boolean = await this.serviceCalendarService.isOpen(Services.TELEGRAM);
        const userDataTicket: UserDataTicket = { phone: telegramRequest.phone };
        let ticket: valueOrUndefined<Ticket> = await this.ticketService.findTicketOnlineWithUserData(userDataTicket, Services.TELEGRAM);
        ticket = (!ticket) ? await this.ticketService.findTicketNewedWithUserData(userDataTicket, Services.TELEGRAM) : ticket;
        if (!ticket) {
            ticket = await this.telegramService.create(telegramRequest, serviceOpened) as Ticket;
        }

        const ticketHistory: TicketHistory = new TicketHistory();
        ticketHistory.id_type = HistoryTypes.USER;
        ticketHistory.action = telegramRequest.message.trim();
        ticketHistory.id_ticket = ticket.id;

        const ticketHistorySaved: TicketHistory = await this.ticketHistoryService.create(ticketHistory) as TicketHistory;
        if (telegramRequest.attachments) {
            forEach(telegramRequest.attachments, async (attachment: AttachmentEmailRequest) => {
                await this.ticketHistoryAttachmentService.create((ticket as Ticket).id, ticketHistorySaved.id, attachment.path, attachment.name);
            });
        }
        this.log.info(`Telegram message create successfully. From: ${telegramRequest.phone} - Message: ${telegramRequest.message}`);
        return ticket;
    }
}
