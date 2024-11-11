import { ISender } from "./ISender";
import { TicketHistory } from "../models/TicketHistory";
import { Service } from "typedi";
import { env } from '../../core/env';
import { Ticket } from "../models/Ticket";
import { Services } from "../enums/TicketServices.enum";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { includes } from "lodash";
import { HttpClient } from "../utils/HttpClient";

@Service()
export class TelegramSender implements ISender {
    constructor(private httpClient: HttpClient) {
    }

    public async send(ticket: Ticket, ticketHistory: TicketHistory): Promise<void> {
        const phoneValue: string = (ticket.id_user) ? ticket.user.userdata.phone : ticket.userUnknown.phone;
        await this.httpClient.post(env.telegram.url, { phone: phoneValue, message: ticketHistory.action });
    }

    public canSend(ticket: Ticket, ticketHistory: TicketHistory): boolean {
        return ticket.id_service === Services.TELEGRAM && includes([HistoryTypes.OPERATOR, HistoryTypes.AUTORESPONDER], ticketHistory.id_type);
    }
}
