import * as _ from 'lodash';
import { assign } from "lodash";
import { Authorized, Body, CurrentUser, Get, HttpError, JsonController, OnUndefined, Param, Post, Put, QueryParam, Req } from "routing-controllers";
import { ResponseSchema } from 'routing-controllers-openapi';
import { In } from "typeorm";
import { TokenInfoInterface } from '../../auth/TokenInfoInterface';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { UserPermissionChecker } from "../checkers/UserPermissionChecker";
import { HistoryTypes } from '../enums/TicketHistoryTypes.enum';
import { TicketStatuses } from "../enums/TicketStatuses.enum";
import { TicketNotCreatedError } from '../errors/TicketNotCreatedError';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';
import { Ticket } from '../models/Ticket';
import { TicketHistory } from '../models/TicketHistory';
import { TicketService as TicketServiceModel } from '../models/TicketService';
import { User } from '../models/User';
import { TicketService } from "../services/TicketService";
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { ticketSanitize } from "../utils/Sanitizer";
import { extractServicesIdsFrom } from "../utils/ServicesIdsRetriever";
import { ValidatorApplier } from "../validators/ValidatorApplier";
import { FilteredTicketRequest } from './requests/FilteredTicketRequest';
import { NewTicketRequest } from './requests/NewTicketRequest';

@JsonController('/ticket')
export class TicketController {
    constructor(
        private ticketService: TicketService,
        private validatorApplier: ValidatorApplier,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Authorized("ticket.get.newed.count")
    @Get("/newedCount")
    public async newedCount(@CurrentUser({ required: true }) user: TokenInfoInterface<User>): Promise<number> {
        return this.ticketService.count({
            where: {
                id_status: TicketStatuses.NEW,
                deleted: 0,
                id_service: In(extractServicesIdsFrom(_.get(user, 'detail.services', []))),
            },
        });
    }

    @Authorized("ticket.get.filtered")
    @Get("/")
    @ResponseSchema(Ticket, {isArray: true})
    @OnUndefined(TicketNotFoundError)
    // tslint:disable-next-line:max-line-length
    public async find(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Req() req?: FilteredTicketRequest): Promise<valueOrUndefined<Ticket[]>> {
        if (req) {
            req = assign(new FilteredTicketRequest(), req);
            await this.validatorApplier.apply<FilteredTicketRequest>(req);
        }
        const userServices: TicketServiceModel[] = _.get(user, 'detail.services', []);
        if (!req || !req.query) {
            return this.ticketService.findAllWith(userServices);
        }

        let returnTickets;
        if (req && req.query && req.query.id_category) {
            returnTickets = await this.ticketService.findFromCategory(req.query.id_category, userServices);
        } else if (req && req.query && req.query.phone) {
            returnTickets = await this.ticketService.findWithPhone(
                req.query.id_status, 
                req.query.id_service,
                req.query.phone
            );
        } else if (req && req.query && req.query.mapped) {
            returnTickets = await this.ticketService.findWithCriteria(
                req.query.mapped, 
                req.query.id_status, 
                req.query.id_user, 
                userServices, 
                req.query.id_service,
                req.query.id_userdata
            );
        }
        this.log.info(`Ticket find successfully with filter: ${JSON.stringify((!!req) ? req.query : '')}`);
        return returnTickets;
    }

    @Authorized()
    @Get('/:id(\\d+)/')
    @ResponseSchema(Ticket)
    @OnUndefined(TicketNotFoundError)
    // tslint:disable-next-line:max-line-length
    public async findOne(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Param('id') id: number): Promise<valueOrUndefined<Ticket>> {
        const userServices: TicketServiceModel[] = _.get(user, 'detail.services', []);
        const relations: string[] = [
            'category',
            'service',
            'status',
            'operator',
            'user',
            'historys',
            'userUnknown',
            'reports',
        ];
        let ticket: valueOrUndefined<Ticket> = (userServices.length === 0) ?
            await this.ticketService.findOneWith(id, relations) : // It is a user
            await this.ticketService.findOne(id, userServices, relations);

        if (user.detail && ticket && (UserPermissionChecker.hasPermission(user.detail, "ticket.edit.all") || user.detail.id === ticket.id_user)) {
            if (!UserPermissionChecker.hasPermission(user.detail, "ticket.historys.read.systemMessage")) {
                // tslint:disable-next-line:max-line-length
                ticket.historys = _.filter(ticket.historys, (history: TicketHistory) => history.id_type ===  HistoryTypes.USER || history.id_type === HistoryTypes.OPERATOR);
            }
            this.log.info(`Ticket find successfully. From ID: ${id}`);
            return ticket;
        }
        return undefined;
    }

    @Authorized()
    @Post()
    @ResponseSchema(Ticket)
    @OnUndefined(TicketNotCreatedError)
    // tslint:disable-next-line:max-line-length
    public async create(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Body() ticketRequest: NewTicketRequest): Promise<valueOrUndefined<Ticket>> {
        ticketRequest = assign(new NewTicketRequest(), ticketRequest);
        await this.validatorApplier.apply<NewTicketRequest>(ticketRequest);

        const ticket: Ticket = new Ticket();
        ticket.id_user = (user.detail as User).id;
        ticket.id_category = Number(ticketRequest.id_category);
        ticket.id_service = ticketRequest.id_service;

        if (await this.ticketService.isValid(ticket)) {
            return await this.ticketService.create(ticket, undefined, ticketRequest.phone, ['user']);
        }
        return undefined;
    }

    @Authorized()
    @Put('/:id')
    @ResponseSchema(Ticket)
    @OnUndefined(TicketNotFoundError)
    // tslint:disable-next-line:max-line-length
    public async update(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Param('id') id: number, @Body({ validate: false }) ticket: Ticket, @QueryParam('force', {required: false}) force?: boolean): Promise<valueOrUndefined<Ticket>> {
        ticket.id = id;
        ticket = ticketSanitize(ticket);
        ticket = assign(new Ticket(), ticket);

        await this.validatorApplier.apply<Ticket>(ticket);

        if (user.detail && ticket && (UserPermissionChecker.hasPermission(user.detail, "ticket.edit.all") || user.detail.id === ticket.id_user)) {
            const ticketSaved: valueOrUndefined<Ticket> = await this.ticketService.findOne(id, _.get(user, 'detail.services', []));
            if (!ticketSaved) {
                this.log.error('[update-ticket] Ticket ID not found.', id);
                throw new HttpError(404, 'TICKET_NOT_FOUND');    
            }

            if (ticketSaved.id_status === TicketStatuses.ONLINE && user.detail.isOperator && user.detail.id !== ticket.id_operator && !force) {
                this.log.error('[update-ticket] Ticket already online and taken from another operator.', id);
                throw new HttpError(500, 'TICKET_ALREADY_ONLINE');
            }
            
            const newTicket: valueOrUndefined<Ticket> = await this.ticketService.update(ticket as Ticket);
            this.log.info(`Ticket update successfully. From: ${(user.detail as User).id} - Ticket ID: ${id}`);
            return newTicket;
        }
        return undefined;
    }
}
