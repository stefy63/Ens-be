import { ISenderDispatcher } from './ISenderDispatcher';
import { TicketHistory } from '../models/TicketHistory';
import { Ticket } from "../models/Ticket";
import { Service } from "typedi";
import { ISender } from "./ISender";
import { SmsSender } from "./SmsSender";
import { forEach } from "lodash";
import { EmailSender } from "./EmailSender";
import { TelegramSender } from "./TelegramSender";

@Service()
export class SenderDispatcher implements ISenderDispatcher {
    private senders: ISender[];

    constructor(smsSender: SmsSender, emailSender: EmailSender, telegramSender: TelegramSender) {
        this.senders = [smsSender, emailSender, telegramSender]; // FIXME: try to use (if exists in typedi) multi-inject
    }

    public async dispatch(ticket: Ticket, ticketHistory: TicketHistory): Promise<void> {
        forEach(this.senders, (sender: ISender) => {
            if (sender.canSend(ticket, ticketHistory)) {
                sender.send(ticket, ticketHistory);
            }
        });
    }
}
