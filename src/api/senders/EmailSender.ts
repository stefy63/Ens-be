import { ISender } from "./ISender";
import { TicketHistory } from "../models/TicketHistory";
import { Service } from "typedi";
import { env } from '../../core/env';
import { Ticket } from "../models/Ticket";
import { Services } from "../enums/TicketServices.enum";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { includes } from "lodash";
import { MailerClient } from "../utils/MailerClient";

@Service()
export class EmailSender implements ISender {
    constructor(private mailerClient: MailerClient) {
    }

    public async send(ticket: Ticket, ticketHistory: TicketHistory): Promise<void> {
        const recipent: string = (ticket.id_user) ? ticket.user.userdata.email : ticket.userUnknown.email;
        await this.mailerClient.send(recipent, env.email.subject, ticketHistory.action);
    }

    public canSend(ticket: Ticket, ticketHistory: TicketHistory): boolean {
        return ticket.id_service === Services.MAIL && includes([HistoryTypes.OPERATOR, HistoryTypes.AUTORESPONDER], ticketHistory.id_type);
    }
}
