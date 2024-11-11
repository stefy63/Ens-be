import { Ticket } from "../models/Ticket";

export function ticketSanitize(ticket: Ticket): Ticket {
    // Remove property relations'
    delete ticket.historys;
    delete ticket.reports;
    delete ticket.service;
    delete ticket.userUnknown;
    delete ticket.user;
    delete ticket.operator;
    delete ticket.status;
    return ticket;    
}
