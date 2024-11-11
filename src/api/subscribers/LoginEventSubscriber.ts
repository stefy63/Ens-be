import { EventSubscriber, On } from 'event-dispatch';
import { events } from './events';
import { Logger } from '../../core/Logger';
import { User } from "../models/User";
import { TypeUser } from '../../lib/websocketIO/SocketIo.types';
import { Container } from 'typedi';
import { SocketIoServer } from '../../lib/websocketIO/SocketIoServer';

const log = new Logger(__filename);
@EventSubscriber()
export class OperatorEventSubscriber {
    private socket: SocketIoServer;
    constructor() {
        this.socket = Container.get<SocketIoServer>('SocketIoServer');
    }

    @On(events.user.login)
    public onLogin(user: User): void {
        log.info('User ' + user.username.toString() + ' Login!');
        this.sendQueueEvents();
    }

    @On(events.user.changeStatus)
    public onChangeStatus(user: User): void {
        log.info('User ' + user.username.toString() + ' Change Status!');
        this.sendQueueEvents();
    }

    @On(events.user.logout)
    public onLogout(user: User): void {
        log.info('User ' + user.username.toString() + ' Logout!');
        this.sendQueueEvents();
    }

    private sendQueueEvents(): void {
        this.socket.broadcastTo({operatorChange: true}, events.queue.operator, TypeUser.User);
    }
}
