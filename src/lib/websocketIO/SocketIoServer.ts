import * as socketIo from 'socket.io';
import * as _ from 'lodash';
import { WelcomeMessage, TypeUser, IMessageToSend } from "./SocketIo.types";
import { Logger } from '../../core/Logger';
import { Container } from 'typedi';
import { TicketService } from '../../api/services/TicketService';
import { AuthService } from "../../auth/AuthService";
import { User } from "../../api/models/User";
import { valueOrUndefined } from '../../api/types/ValueOrUndefined';
import * as redisAdapter from 'socket.io-redis';
import { env } from "../../core/env";
import { TicketService as TicketServiceModel } from '../../api/models/TicketService';

const log = new Logger(__filename);

export class SocketIoServer {
    private socketServer: SocketIO.Server;
    private ticketService: TicketService;
    private authService: AuthService;

    constructor(
        server: any,
        port: any
    ) {
        this.socketServer = socketIo(server, { path: '/' + env.socketIo.path }).listen(port);
        this.socketServer.adapter(redisAdapter({
            key: `ermes__ws`,
            host: env.redis.host,
            port: env.redis.port,
        }));

        this.socketServer.origins('*:*');
        this.ticketService = Container.get<TicketService>('TicketService');
        this.authService = Container.get<AuthService>('AuthService');
    }

    public listen(): void {
        this.socketServer.on('connect', (socket: SocketIO.Socket) => {
            let userToken: string;
            log.info('Client connected');

            socket.on('welcome-message', async (message: WelcomeMessage) => {
                const user: valueOrUndefined<User> = (await this.authService.getTokenInfo(message.userToken)).detail;
                if (!user) {
                    return;
                }

                userToken = user.token.token_session;
                const roomPrefix = (user.isOperator) ? TypeUser.Operator : TypeUser.User;
                socket.join(`${roomPrefix}`);
                socket.join(`${roomPrefix}_${userToken}`);

                if (message.idTicket) {
                    socket.join(`${roomPrefix}_${userToken}_${message.idTicket}`);
                }
                _.forEach(user.services, (item: TicketServiceModel) => {
                    socket.join(`${roomPrefix}_${item.id}`); // Room for every service
                });
            });

            socket.on('send-to', async (message: IMessageToSend) => {
                const user: valueOrUndefined<User> = (await this.authService.getTokenInfo(userToken)).detail;
                if (!user) {
                    return;
                }

                const data = await this.ticketService.findOneWith(message.idTicket);
                if (data) {
                    const idTicket = (user.isOperator) ? 0 : message.idTicket;
                    const _sendTo = (user.isOperator) ? [data.id_user] : [data.id_operator];
                    this.emit(message.obj, message.event, _sendTo, idTicket);
                    log.info('New Generic event emitted!', message);
                }
            });

            socket.on('disconnect', async () => {
                log.info('Client disconnected', userToken);
                socket.leaveAll();
            });
        });
    }

    public async broadcastTo(obj: any, event: string, target: TypeUser, serviceId?: number): Promise<void> {
        const room = (serviceId) ? `${target}_${serviceId}` : `${target}`;
        this.socketServer.to(room).emit(event, obj);
        log.debug(`broadcast event ${event} to ${room}`, obj);
    }

    public async emit(obj: any, event: string, idTarget: number[], idTicket?: number): Promise<void> {
        _.forEach(idTarget, async (target) => {
            if (!target) {
                return;
            }
            const user: valueOrUndefined<User> = (await this.authService.getTokenInfoFor(target)).detail;
            if (!user) {
                return;
            }
            const roomPrefix = (user.isOperator) ? TypeUser.Operator : TypeUser.User;
            let room = `${roomPrefix}_${user.token.token_session}`;
            if (!user.isOperator && idTicket) {
                room += `_${idTicket}`;
            }

            log.debug(`emit to ${room} | event => ${event} : ${JSON.stringify(obj)}`);
            this.socketServer.to(room).emit(event, obj);
        });
    }
}
