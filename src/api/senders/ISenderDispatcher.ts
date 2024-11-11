import { Ticket } from "../models/Ticket";
import { TicketHistory } from '../models/TicketHistory';

export interface ISenderDispatcher {
    dispatch(ticket: Ticket, ticketHistory: TicketHistory): Promise<void>;
}
