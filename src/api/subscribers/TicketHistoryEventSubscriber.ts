import { EventSubscriber, On } from 'event-dispatch';
import { events } from './events';
import { Logger } from '../../core/Logger';
import { Container } from 'typedi';
import { SocketIoServer } from '../../lib/websocketIO/SocketIoServer';
import { Ticket } from '../../api/models/Ticket';

const log = new Logger(__filename);


@EventSubscriber()
export class TicketHistoryEventSubscriber {
    private socket: SocketIoServer;
    private arrHistory: number[] = [];

    constructor() {
        this.socket = Container.get<SocketIoServer>('SocketIoServer');
    }

    @On(events.ticketHistory.create)
    public onTicketHistoryCreate(ticket: Ticket): void {
        log.info('New Ticket History created!');
        this.arrHistory =  [ticket.id_operator, ticket.id_user];
        this.socket.emit(ticket, events.ticketHistory.create, this.arrHistory);
    }

    @On(events.ticketHistory.updated)
    public onTichetHistoryUpdated(ticket: Ticket): void {
        log.info('Ticket History set to Readed! ');
        this.arrHistory =  [ticket.id_operator, ticket.id_user];
        this.socket.emit(ticket, events.ticketHistory.updated,  this.arrHistory);
    }

}
