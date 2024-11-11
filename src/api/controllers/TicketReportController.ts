import { JsonController, Post, OnUndefined, CurrentUser, Param, Body, Authorized, Get, Req, Res } from 'routing-controllers';
import { TicketReportNotFoundError } from '../errors/TicketReportNotFoundError';
import { TokenInfoInterface } from '../../auth/TokenInfoInterface';
import { User } from '../models/User';
import { TicketService } from '../services/TicketService';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { Ticket } from '../models/Ticket';
import { TicketReportType, TicketReportRaw } from '../types/TicketReport.type';
import { TicketReportService } from '../services/TicketReportService';
import { UserPermissionChecker } from '../checkers/UserPermissionChecker';
import { join } from "lodash";
import * as useragent from "useragent";
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TicketService as TicketServiceModel } from '../models/TicketService';
import { get, assign } from 'lodash';
import { TicketExportReportRequest } from "./requests/TicketExportReportRequest";
import { EventDispatcher } from 'event-dispatch';
import { events } from '../subscribers/events';
import { ValidatorApplier } from '../validators/ValidatorApplier';
import { TicketReportTypeRequest } from './requests/TicketReportTypeRequest';
import { ResponseSchema } from 'routing-controllers-openapi';
import * as moment from 'moment';


@JsonController('/ticketreport')
export class TicketReportController {

    constructor(
        private ticketService: TicketService,
        private ticketReportService: TicketReportService,
        @Logger(__filename) private log: LoggerInterface,
        private eventDispatcher: EventDispatcher,
        private validatorApplier: ValidatorApplier

    ) { }

    @Authorized(['ticket.get.my_export_report', 'ticket.get.all_export_report'])
    @Get()
    @OnUndefined(TicketReportNotFoundError)
    // tslint:disable-next-line:max-line-length
    public async getQuery(@CurrentUser() user: TokenInfoInterface<User>, @Req() req: any, @Res() response: any): Promise<valueOrUndefined<Ticket[]>> {
        if (!user.detail) {
            return undefined;
        }
        const queryParams: TicketExportReportRequest = assign({}, req.query as TicketExportReportRequest, {
            id_office: req.query.id_office || user.detail.id_office,
        });

        let entitys;
        if (UserPermissionChecker.hasPermission(user.detail, 'ticket.get.all_export_report')) {
            entitys = await this.ticketReportService.getTicketExport(queryParams);
        } else {
            entitys = await this.ticketReportService.getTicketExport(queryParams, user.detail.id);
        }

        // tslint:disable-next-line:max-line-length
        const isWindows = useragent.parse(req.headers['user-agent']).os.toString().includes('Windows');
        const EOL = (isWindows) ? '\r\n' : '\n';
        const CSV_DELIMITER_CHAR = ";";
        let csvContent = join([
            'TICKET N.',
            'CATEGORIA',
            'SERVIZIO',
            'STATO',
            'SEDE OPERATORE',
            'FAKE ID',
            'OPERATORE NOME',
            'OPERATORE COGNOME',
            'UTENTE NOME',
            'UTENTE COGNOME',
            'QTA NUMERI CONTATTATI',
            'NUMERI CONTATTATI',
            'DATA',
            'NUMERO MESSAGGI OPERATORE',
            'NUMERO MESSAGGI UTENTE',
            'NUMERO MESSAGGI TOTALI',
        ], CSV_DELIMITER_CHAR);
        entitys.forEach((ticketRaw: TicketReportRaw) => {
            const ticket_history_user_number = (ticketRaw.ticket_user_num_history) ? Number(ticketRaw.ticket_user_num_history) : 0;
            const ticket_history_operator_number = (ticketRaw.ticket_op_num_history) ? Number(ticketRaw.ticket_op_num_history) : 0;
            const date =  moment(ticketRaw.ticket_date_time, 'DD-MM-YYYY HH:mm:ss').toDate();
            // tslint:disable-next-line: max-line-length
            const fakeID_operator = Math.ceil(parseInt('' + date.getDate() + date.getMonth() + '' + date.getFullYear(), 10) * 1000 / ticketRaw.operatordata_id) + date.getMonth() * 10000;

            csvContent += EOL;
            csvContent += [
                ticketRaw.ticket_id,
                (ticketRaw.category_deleted) ? 'DELETED' : ticketRaw.category_category,
                ticketRaw.service_service,
                ticketRaw.status_status,
                ticketRaw.operator_office_office,
                (isFinite(fakeID_operator)) ? fakeID_operator : ' - ',
                ticketRaw.operatordata_name,
                ticketRaw.operatordata_surname,
                ticketRaw.userdatas_name,
                ticketRaw.userdatas_surname,
                (ticketRaw.phones) ?  ticketRaw.phones.split(' - ').length : 0,
                ticketRaw.phones,
                ticketRaw.ticket_date_time,
                ticket_history_operator_number,
                ticket_history_user_number,
                ticket_history_user_number + ticket_history_operator_number,
            ].join(CSV_DELIMITER_CHAR);
        });

        this.log.info(`CSV File create with filters: ${JSON.stringify(queryParams)} - From User: ${(user.detail as User).id}`);
        response.set('Content-disposition', 'attachment; filename=report.csv');
        response.set('File-Name', 'report.csv');
        response.set('Content-Type', 'text/csv');
        response.set('Access-Control-Expose-Headers', 'File-Name');
        return response.status(200).send(csvContent);
    }

    @Authorized()
    @Post('/:id_ticket')
    @ResponseSchema(TicketReportTypeRequest, {isArray: true})
    @OnUndefined(TicketReportNotFoundError)
    // tslint:disable-next-line:max-line-length
    public async create(@CurrentUser() user: TokenInfoInterface<User>, @Param('id_ticket') _id_ticket: number, @Body({ validate: false }) ticketReport: TicketReportTypeRequest[]): Promise<valueOrUndefined<TicketReportType[]>> {
        ticketReport.forEach(async (item) => {
            item = assign(new TicketReportTypeRequest(), item);
            await this.validatorApplier.apply<TicketReportTypeRequest>(item);
        }) ;
        if (user.detail && user.detail.isOperator) {
            const userServices: TicketServiceModel[] = get(user, 'detail.services', []);
            const ticket: valueOrUndefined<Ticket> = await this.ticketService.findOne(_id_ticket, userServices);
            if (!ticket || ticket.id_operator !== user.detail.id) {
                return undefined;
            }
            ticketReport.forEach((item: TicketReportType) => {
                item.id_ticket = _id_ticket;
            });


            await this.ticketReportService.save(ticketReport);
            this.log.info(`Report create for Ticket ID: ${_id_ticket} - From User: ${(user.detail as User).id}`);

            const outputTicket = await this.ticketService.findOne(_id_ticket, userServices, ["reports"]);
            this.eventDispatcher.dispatch(events.ticket.updated, outputTicket);
            return ticketReport;
        }
        return undefined;
    }



}
