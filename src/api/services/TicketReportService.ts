import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TicketReportRepository } from '../repositories/TicketReportRepository';
import { Transaction, TransactionRepository, SelectQueryBuilder } from 'typeorm';
import { TicketExportReportRequest } from '../controllers/requests/TicketExportReportRequest';
import { TicketRepository } from '../repositories/TicketRepository';
import { TicketReportType, TicketReportRaw } from '../types/TicketReport.type';
import { TicketReport } from '../models/TicketReport';
import { TicketStatuses } from '../enums/TicketStatuses.enum';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class TicketReportService {

    constructor(
        @OrmRepository() private ticketReportRepository: TicketReportRepository,
        @OrmRepository() private ticket: TicketRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(options?: any): Promise<any[]> {
        const finded = await this.ticketReportRepository.find(options);
        this.log.debug('Find Report: ', finded);
        return finded;
    }

    @Transaction()
    public async save(reports: TicketReportType[], @TransactionRepository(TicketReport) ticketReportRepository?: TicketReportRepository): Promise<boolean> {
        if (ticketReportRepository === undefined) { return false; }
        try {
            await ticketReportRepository.createQueryBuilder()
                .delete()
                .where('id_ticket = :idTicket', { idTicket: reports[0].id_ticket })
                .execute();


            await Promise.all(reports.map((entity) => {
                this.log.debug('Save Report Item: ', entity);
                return ticketReportRepository.save(entity);
            }));
        } catch (err) {
            this.log.debug('Error in Save Report Item with: ', err);
            return false;
        }

        return true;
    }


    public async getTicketExport(query: TicketExportReportRequest, grant?: number): Promise<TicketReportRaw[]> {
        const report_export = this.ticket.createQueryBuilder('ticket')
            .select([
                'ticket.id',
                'ticket.op_num_history',
                'ticket.user_num_history',
                'service.service',
                'status.status',
                'operator_office.office',
                'operatordata.name',
                'operatordata.surname',
                'operatordata.id',
            ])
            .addSelect("IFNULL(userdatas.name, 'UNKNOWN')", 'userdatas_name')
            .addSelect("IFNULL(userdatas.surname, 'UNKNOWN')", 'userdatas_surname')
            .addSelect("DATE_FORMAT(ticket.date_time, '%d-%m-%Y %H:%i:%S')", "ticket_date_time")
            .addSelect((qb) => this.concatPhones(qb), 'phones')
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoin('ticket.service', 'service')
            .leftJoin('ticket.status', 'status')
            .leftJoin('ticket.operator', 'operator')
            .leftJoin('ticket.user', 'user')
            .leftJoin('operator.userdata', 'operatordata')
            .leftJoin('user.userdata', 'userdatas')
            .leftJoin('operator.office', 'operator_office');

        if (query.status) {
            report_export.where('id_status = :idStatus', { idStatus: Number(query.status) });
        } else { // !important: not cancel this 'else' otherwise returns all the tickets
            report_export.where('id_status != :idStatus', { idStatus: TicketStatuses.UNAVAILABLE });
        }

        if (grant) { report_export.andWhere('id_operator = :idOperator', { idOperator: grant }); }
        if (query.category) { report_export.andWhere('id_category = :idCategory', { idCategory: Number(query.category) }); }
        if (query.date_start) { report_export.andWhere('ticket.date_time >= :date_start', { date_start: query.date_start }); }
        if (query.date_end) { report_export.andWhere('ticket.date_time <= :date_end', { date_end: query.date_end }); }
        if (query.phone) { report_export.andWhere('ticket.id IN ' + this.exportPhoneFilter(report_export, query.phone)); }
        if (query.id_service) { report_export.andWhere('ticket.id_service = :idService', {idService: query.id_service}); }
        if (query.id_office) { report_export.andWhere('operator.id_office = :idOffice', {idOffice: query.id_office}); }

        this.log.debug('Export reports from filter: ', query);
        return await report_export.getRawMany();
    }

    private concatPhones(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
        return qb.subQuery().from(TicketReport, "ticketReport")
        .select("GROUP_CONCAT(number SEPARATOR ' - ')", "group_phone")
        .where('id_ticket = ticket_id')
        .groupBy('id_ticket');
    }

    private exportPhoneFilter(qb: SelectQueryBuilder<any>, phone: number): string {
        return qb.subQuery().select('id_ticket')
            .from(TicketReport, 'reports')
            .where('number LIKE :phone', { phone: phone + '%' })
            .getQuery();
    }
}
