import { JsonController, Post, Body } from "routing-controllers";
import { valueOrUndefined } from "../types/ValueOrUndefined";
import { Ticket } from "../models/Ticket";
import { TicketService } from "../services/TicketService";
import { TicketHistory } from "../models/TicketHistory";
import { TicketHistoryService } from "../services/TicketHistoryService";
import { EmailManagerRequest, AttachmentEmailRequest } from "./requests/EmailManagerRequest";
import { EmailService } from "../services/EmailService";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { ServiceCalendarService } from '../services/ServiceCalendarService';
import { Services } from "../enums/TicketServices.enum";
import { UserDataTicket } from "../types/UserDataTicket.type";
import { TicketHistoryAttachmentService } from '../services/TicketHistoryAttachmentService';
import { forEach, assign } from "lodash";
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ValidatorApplier } from "../validators/ValidatorApplier";

@JsonController("/emailmanager")
export class SmsController {
    constructor(
        private emailService: EmailService,
        private ticketService: TicketService,
        private ticketHistoryService: TicketHistoryService,
        private serviceCalendarService: ServiceCalendarService,
        private ticketHistoryAttachmentService: TicketHistoryAttachmentService,
        private validatorApplier: ValidatorApplier,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Post()
    public async create(@Body() emailManagerRequest: EmailManagerRequest): Promise<valueOrUndefined<Ticket>> {
        emailManagerRequest = assign(new EmailManagerRequest(), emailManagerRequest);
        await this.validatorApplier.apply<EmailManagerRequest>(emailManagerRequest);

        const serviceOpened: boolean = await this.serviceCalendarService.isOpen(Services.MAIL);
        const userDataTicket: UserDataTicket = { email: emailManagerRequest.sender };
        let ticket: valueOrUndefined<Ticket> = await this.ticketService.findTicketOnlineWithUserData(userDataTicket, Services.MAIL);
        ticket = (!ticket) ? await this.ticketService.findTicketNewedWithUserData(userDataTicket, Services.MAIL) : ticket;
        if (!ticket) {
            ticket = await this.emailService.createEmail(emailManagerRequest, serviceOpened) as Ticket;
        }

        const ticketHistory: TicketHistory = new TicketHistory();
        ticketHistory.id_type = HistoryTypes.USER;
        ticketHistory.action = emailManagerRequest.message.trim();
        ticketHistory.id_ticket = ticket.id;

        const ticketHistorySaved: TicketHistory = await this.ticketHistoryService.create(ticketHistory) as TicketHistory;
        if (emailManagerRequest.attachments) {
            forEach(emailManagerRequest.attachments, async (attachment: AttachmentEmailRequest) => {
                await this.ticketHistoryAttachmentService.create((ticket as Ticket).id, ticketHistorySaved.id, attachment.path, attachment.name);
            });
        }

        this.log.info(`Email create successfully From: ${emailManagerRequest.sender} - Subject: ${emailManagerRequest.subject}`);
        return ticket;
    }

}
