import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { SocketIoServer } from '../lib/websocketIO/SocketIoServer';
import { normalizePort } from '../lib/websocketIO/Utils';
import { env } from '../core/env';
import { Container } from 'typedi';
import { ServiceChecker } from "../api/services/ServiceChecker";

export const socketIoLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.socketIo.enabled) {
        const expressServer = settings.getData('express_server');
        const SocketIoPort =  normalizePort(env.socketIo.port || '9000');
        const SocketIo = new SocketIoServer(expressServer, SocketIoPort);
        SocketIo.listen();
        Container.set('ServiceChecker', ServiceChecker);
        Container.set('SocketIoServer', SocketIo);
    }
};
