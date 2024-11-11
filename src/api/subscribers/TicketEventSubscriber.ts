import { EventSubscriber, On } from 'event-dispatch';
import { events } from './events';
import { Logger } from '../../core/Logger';
import { Container } from 'typedi';
import { SocketIoServer } from '../../lib/websocketIO/SocketIoServer';
import { Ticket } from '../../api/models/Ticket';
import { TypeUser } from '../../lib/websocketIO/SocketIo.types';
import { TicketStatuses } from '../enums/TicketStatuses.enum';

const log = new Logger(__filename);

@EventSubscriber()
export class TicketEventSubscriber {
    private socket: SocketIoServer;

    constructor() {
        this.socket = Container.get<SocketIoServer>('SocketIoServer');
    }

    @On(events.ticket.create)
    public async onTicketCreate(ticket: Ticket): Promise<void> {
        log.info('New Ticket created!');
        this.socket.broadcastTo(ticket, events.ticket.create, TypeUser.Operator, ticket.id_service);
    }

    @On(events.ticket.updated)
    public onTichetUpdated(ticket: Ticket): void {
        log.info('New Ticket Updated! ');
        this.socket.broadcastTo(ticket, events.ticket.updated, TypeUser.Operator);
        if (ticket.id_status > TicketStatuses.NEW) {
            this.socket.broadcastTo({ticketUpdated: true}, events.queue.ticket, TypeUser.User);
        }
        if (ticket.id_user) {
            this.socket.emit(ticket, events.ticket.updated, [ticket.id_user]);
        }
    }

    @On(events.ticket.deleted)
    public onTichetDeleted(ticket: Ticket): void {
        log.info('New Ticket deleted! ');
        this.socket.broadcastTo(ticket, events.ticket.deleted, TypeUser.Operator);
        this.socket.broadcastTo({ticketClosed: 1}, events.queue.ticket, TypeUser.User);
    }
}
