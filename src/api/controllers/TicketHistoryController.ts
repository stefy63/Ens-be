import { JsonController, Authorized, Param, OnUndefined, Post, Put, Delete, Body, CurrentUser, Get } from 'routing-controllers';
import { TicketHistory } from '../models/TicketHistory';
import { TicketHistoryService } from '../services/TicketHistoryService';
import { TicketHistoryNotFoundError } from '../errors/TicketHistoryNotFoundError';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { TicketService } from '../services/TicketService';
import { Ticket } from '../models/Ticket';
import { TokenInfoInterface } from '../../auth/TokenInfoInterface';
import { User } from "../models/User";
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TicketService as TicketServiceModel } from '../models/TicketService';
import { get } from "lodash"; 
import { ResponseSchema } from 'routing-controllers-openapi';
@JsonController('/tickethistory')
export class TicketHistoryController {

    constructor(
        private ticketHistoryService: TicketHistoryService,
        private ticketService: TicketService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Authorized()
    @Get('/unreaded')
    public getUnreadedMessages(@CurrentUser() user: TokenInfoInterface<User>): Promise<number> {
        if (user.detail && user.detail.isOperator) {
            return this.ticketHistoryService.getUnreadedMessages(user.detail.id);
        }
        return Promise.resolve(0);
    }

    @Authorized()
    @Post()
    @ResponseSchema(TicketHistory, {isArray: true})
    @OnUndefined(TicketHistoryNotFoundError)
    // tslint:disable-next-line:max-line-length
    public async create(@CurrentUser() user: TokenInfoInterface<User>, @Body({ validate: false }) ticketHistory: TicketHistory): Promise<valueOrUndefined<TicketHistory>> {
        if (user.detail && user.detail.isOperator) {
            // tslint:disable-next-line:no-shadowed-variable
            const userServices: TicketServiceModel[] = get(user, 'detail.services', []);
            const ticket: valueOrUndefined<Ticket> = await this.ticketService.findOne(ticketHistory.id_ticket, userServices);
            if (!ticket) {
                return undefined;
            }
            if (ticket.id_user !== user.detail.id && ticket.id_operator !== user.detail.id) {
                return undefined;
            }
        }
        const newTicketHistory: valueOrUndefined<TicketHistory> = await this.ticketHistoryService.create(ticketHistory);
        this.log.info(`Ticket History create successfully. From: ${(user.detail as User).id} - History Action: ${(newTicketHistory as TicketHistory).action}`);
        return newTicketHistory;
    }

    @Authorized()
    @Put('/readed/:id_ticket')
    @OnUndefined(TicketHistoryNotFoundError)
    public async updateReaded(@Param('id_ticket') id: number, @CurrentUser() user: TokenInfoInterface<User>): Promise<boolean> {
        await this.ticketHistoryService.updateReaded(id);
        this.log.info(`Ticket History update readed. For ID: ${id}. From: ${(user.detail as User).id}`);
        return true;
    }

    @Authorized()
    @Delete('/:id')
    public async delete(@Param('id') id: number, @CurrentUser() user: TokenInfoInterface<User>): Promise<boolean> {
        const history: TicketHistory = new TicketHistory();
        history.id = id;
        await this.ticketHistoryService.delete(history);
        this.log.info(`Ticket History delete. History ID: ${id}. From: ${(user.detail as User).id}`);
        return true;
    }

}
