import { JsonController, Get, Req, Post, Authorized, Body, CurrentUser } from "routing-controllers";
import { SmsManagerRequest } from "./requests/SmsManagerRequest";
import { valueOrUndefined } from "../types/ValueOrUndefined";
import { Ticket } from "../models/Ticket";
import { SmsService } from '../services/SmsService';
import { TicketService } from "../services/TicketService";
import { TicketHistory } from "../models/TicketHistory";
import { TicketHistoryService } from "../services/TicketHistoryService";
import { HistoryTypes } from "../enums/TicketHistoryTypes.enum";
import { ServiceCalendarService } from "../services/ServiceCalendarService";
import { Services } from "../enums/TicketServices.enum";
import { UserDataTicket } from "../types/UserDataTicket.type";
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { assign } from 'lodash';
import { ValidatorApplier } from "../validators/ValidatorApplier";
import { ResponseSchema } from 'routing-controllers-openapi';
import { ReverseSmsRequest } from './requests/ReverseSmsRequest';
import { User } from '../models/User';
import { TokenInfoInterface } from 'src/auth/TokenInfoInterface';
import { TicketStatuses } from '../enums/TicketStatuses.enum';
import { TicketItemList } from '../models/TicketItemList';

@JsonController("/smsmanager")
export class SmsController {
    constructor(
        private smsService: SmsService,
        private ticketService: TicketService,
        private ticketHistoryService: TicketHistoryService,
        private serviceCalendarService: ServiceCalendarService,
        private validatorApplier: ValidatorApplier,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    @Get()
    @ResponseSchema(Ticket)
    public async create(@Req() req: any): Promise<valueOrUndefined<Ticket>> {
        let _smsRequest: SmsManagerRequest = assign(new SmsManagerRequest(), req.query);
        await this.validatorApplier.apply<SmsManagerRequest>(_smsRequest);

        _smsRequest.orig =  _smsRequest.orig.replace('+39', '');

        const serviceOpened: boolean = await this.serviceCalendarService.isOpen(Services.SMS);
        const userDataTicket: UserDataTicket = {phone: _smsRequest.orig};
        let ticket: valueOrUndefined<Ticket> = await this.ticketService.findTicketOnlineWithUserData(userDataTicket, Services.SMS);
        ticket = (!ticket) ? await this.ticketService.findTicketNewedWithUserData(userDataTicket, Services.SMS) : ticket;

        if (!ticket) {
            ticket = await this.smsService.createSms(_smsRequest, serviceOpened) as Ticket;
        }

        const ticketHistory: TicketHistory = new TicketHistory();
        ticketHistory.id_type = HistoryTypes.USER;
        ticketHistory.action = _smsRequest.body;
        ticketHistory.id_ticket = ticket.id;

        await this.ticketHistoryService.create(ticketHistory);
        this.log.info(`SMS create successfully. From: ${_smsRequest.orig} - Message: ${_smsRequest.body}`);
        return ticket;
    }

    @Authorized('sending.reverse.sms')
    @Post('/reverse')
    @ResponseSchema(Ticket)
    // tslint:disable-next-line:max-line-length
    public async createReverse(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Body({ validate: false }) reverseSmsRequest: ReverseSmsRequest): Promise<valueOrUndefined<Ticket>> {
        let _smsSmsReverse: ReverseSmsRequest = assign(new ReverseSmsRequest(), reverseSmsRequest);
        await this.validatorApplier.apply<ReverseSmsRequest>(_smsSmsReverse);

        let ticket: Ticket = new Ticket();
        ticket.id_service = Services.SMS;
        ticket.id_operator = (user.detail as User).id;
        ticket.id_status = TicketStatuses.ONLINE;
        ticket.id_category = _smsSmsReverse.id_category;

        const ticketsWithSamePhone: valueOrUndefined<TicketItemList[]> = await this.ticketService.findWithPhone(
            TicketStatuses.ONLINE, 
            Services.SMS,
            reverseSmsRequest.phone
        );
        if (ticketsWithSamePhone && ticketsWithSamePhone.length > 0) {
            throw new Error("ONLINE_TICKET_WITH_SAME_PHONE");
        }

        let ticketInsert: valueOrUndefined<Ticket> = await this.ticketService.create(ticket, { phone: reverseSmsRequest.phone });
        if (!ticketInsert) {
            throw new Error("Error in creating new ticket");
        }
        const ticketHistory: TicketHistory = new TicketHistory();
        ticketHistory.id_type = HistoryTypes.OPERATOR;
        ticketHistory.action = reverseSmsRequest.message;
        ticketHistory.id_ticket = ticketInsert.id;

        await this.ticketHistoryService.create(ticketHistory);
        this.log.info(`Reverse SMS create successfully. To: ${reverseSmsRequest.phone} - Message: ${reverseSmsRequest.message}`);
        return ticketInsert;

    }
}
