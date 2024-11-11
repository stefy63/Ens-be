import { Authorized, Get, JsonController, OnUndefined, Param } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { QueueEmptyError } from '../errors/QueueEmpty';
import { Ticket } from "../models/Ticket";
import { TicketRepository } from '../repositories/TicketRepository';
import { QueueResultService } from '../services/QueueResultService';
import { QueueInfoResult } from '../types/QueueRequest.type';
import { QueueOpResponse } from './responses/QueueOpResponse';
import { QueueResponse } from './responses/QueueResponse';

@JsonController('/queue')
export class QueueController {

    constructor(
        @OrmRepository() private ticketRepository: TicketRepository,
        private queueResultService: QueueResultService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Authorized()
    @Get('/:idTicket')
    @OnUndefined(QueueEmptyError)
    @ResponseSchema(QueueResponse)
    public async getInfoQueue(@Param('idTicket') id: number): Promise<QueueInfoResult> {
        const ticket: Ticket = await this.ticketRepository.findOne(id) as Ticket;
        if (!ticket) {
            throw new Error("ticket not found");
        }

        const operatorActiveNumber: number = await this.queueResultService.getOperatorByService(ticket.id_service);
        const operatorBusyNumber: number = await this.queueResultService.getOperatorBusyByService(ticket.id_service);
        const ticketInWaitingNumber: number = await this.queueResultService.getTicketQueueByIdAndService(id, ticket.id_service);
        this.log.info(`Info Queue Request, response successfully. Operator: ${operatorActiveNumber} - Ticket in queue: ${ticketInWaitingNumber}`);
        return {
            operatorActive: operatorActiveNumber,
            operatorBusy: operatorBusyNumber,
            ticketInWaiting: ticketInWaitingNumber,
        };
    }


    @Authorized()
    @Get('/operator/:idService')
    @OnUndefined(QueueEmptyError)
    @ResponseSchema(QueueOpResponse)
    public async getOperatorQueue(@Param('idService') id_service: number): Promise<QueueOpResponse> {

        const operatorActiveNumber: number =  await this.queueResultService.getOperatorByService(id_service);

        this.log.info(`Operator Queue Request, response successfully. Operator: ${operatorActiveNumber}`);
        return {
            operatorActive: operatorActiveNumber,
        };
    }
}
