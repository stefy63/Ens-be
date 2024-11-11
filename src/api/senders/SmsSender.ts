import { ISender } from "./ISender";
import { TicketHistory } from "../models/TicketHistory";
import { HttpClient } from "../utils/HttpClient";
import { Service } from "typedi";
import { env } from '../../core/env';
import { Ticket } from "../models/Ticket";
import { Services } from "../enums/TicketServices.enum";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { includes } from "lodash";

@Service()
export class SmsSender implements ISender {
    constructor(private httpClient: HttpClient) {
    }

    public async send(ticket: Ticket, ticketHistory: TicketHistory): Promise<void> {
        const phone: string = (ticket.id_user) ? ticket.user.userdata.phone : ticket.userUnknown.phone;

        await this.httpClient.get<any>(env.sms.url, {
            id: env.sms.id,
            key: env.sms.key,
            mobile: phone,
            sms: ticketHistory.action,
        }, {});
    }

    public canSend(ticket: Ticket, ticketHistory: TicketHistory): boolean {
        return ticket.id_service === Services.SMS && includes([HistoryTypes.OPERATOR, HistoryTypes.AUTORESPONDER], ticketHistory.id_type);
    }
}
