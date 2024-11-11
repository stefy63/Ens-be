import { TicketHistory } from "../models/TicketHistory";
import { Ticket } from "../models/Ticket";

export interface ISender {
    send(ticket: Ticket, ticketHistory: TicketHistory): Promise<void>;
    canSend(ticket: Ticket, ticketHistory: TicketHistory): boolean;
}
