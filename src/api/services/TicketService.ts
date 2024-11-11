import { TicketHistoryRepository } from './../repositories/TicketHistoryRepository';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TicketRepository } from '../repositories/TicketRepository';
import { Ticket } from '../models/Ticket';
import { valueOrUndefined } from 'src/api/types/ValueOrUndefined';
import { events } from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { FindManyOptions, SelectQueryBuilder, In } from 'typeorm';
import { env } from '../../core/env';
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";
import { UserDataTicket } from "../types/UserDataTicket.type";
import { UserDataService } from "./UserDataService";
import { User } from '../models/User';
import { UserUnknownService } from "./UserUnknownService";
import { UserUnknown } from "../models/UserUnknown";
import { isEmpty } from "lodash";
import { Services } from "../enums/TicketServices.enum";
import { TicketReport } from "../models/TicketReport";
import { TicketReportService } from "./TicketReportService";
import { TicketStatuses } from '../enums/TicketStatuses.enum';
import { TicketHistory } from '../models/TicketHistory';
import { TicketService as TicketServiceModel } from '../models/TicketService';
import { HistoryTypes } from '../enums/TicketHistoryTypes.enum';
import { extractServicesIdsFrom } from '../utils/ServicesIdsRetriever';
import { getManager } from "typeorm";
import { TicketItemList } from "../models/TicketItemList";
import { ticketSanitize } from '../utils/Sanitizer';

@Service('TicketService')
export class TicketService {

    constructor(
        private userDataService: UserDataService,
        private userUnknownService: UserUnknownService,
        @OrmRepository() private ticketRepository: TicketRepository,
        @OrmRepository() private ticketHistoryRepository: TicketHistoryRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        private ticketReportService: TicketReportService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async findAllWith(ticketServices: TicketServiceModel[]): Promise<Ticket[]> {
        this.log.debug('Find all Ticket with services: ', ticketServices);
        return await this.ticketRepository.find({
            where: {
                deleted: 0,
                id_service: In(extractServicesIdsFrom(ticketServices)),
            },
        });
    }

    public async count(options?: FindManyOptions<Ticket>): Promise<number> {
        this.log.debug('Count Ticket from options: ', options);
        return await this.ticketRepository.count(options);
    }

    public async findFromCategory(idCategory: number, ticketServices: TicketServiceModel[]): Promise<valueOrUndefined<Ticket[]>> {
        this.log.debug('Find all Ticket from category ID: ', idCategory);
        return await this.ticketRepository.find({
            where: {
                deleted: 0,
                id_category: idCategory,
                id_service: In(extractServicesIdsFrom(ticketServices)),
            },
            order: { date_time: 'ASC' },
        } as FindOneOptions<Ticket>);
    }

    public async findWithPhone(id_status: TicketStatuses, id_service: Services, _phone: string): Promise<valueOrUndefined<TicketItemList[]>> {
        const query = getManager()
            .createQueryBuilder(TicketItemList, 'ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('user.userdata', 'userdatas')
            .leftJoinAndSelect('ticket.userUnknown', 'userUnknown')
            .where('ticket.deleted = 0')
            .andWhere("(userdatas.phone LIKE :phone OR userUnknown.phone=:phone)", {phone: _phone})
            .andWhere('ticket.id_status = :idstatus', { idstatus: Number(id_status) })
            .andWhere('ticket.id_service = :idservice', {idservice: id_service});

        return query.orderBy('ticket.date_time', 'ASC').getMany();
    }

    public async findWithCriteria(interval: number,
                                  id_status: number,
                                  id_operator: number,
                                  ticketServices: TicketServiceModel[],
                                  id_service?: Services,
                                  id_userdata?: number): Promise<valueOrUndefined<TicketItemList[]>> {
        this.log.debug('Find all Ticket between date, id_status, id_operator: ', interval, id_status, id_operator);
        const allow_status = [TicketStatuses.NEW, TicketStatuses.ONLINE];
        const result = getManager()
            .createQueryBuilder(TicketItemList, 'ticket')
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.service', 'service')
            .leftJoinAndSelect('ticket.status', 'status')
            .leftJoinAndSelect('ticket.operator', 'operator')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('operator.userdata', 'userdata')
            .leftJoinAndSelect('user.userdata', 'userdatas')
            .leftJoinAndSelect('ticket.userUnknown', 'userUnknown')
            .leftJoinAndSelect('ticket.reports', 'reports')
            .where('ticket.deleted = 0')
            .andWhere('ticket.id_service IN (:services)', { services: extractServicesIdsFrom(ticketServices) })
            .andWhere('(ticket.date_time > DATE_SUB(NOW() , INTERVAL :limit DAY) OR ticket.id_status IN (:filter))', { limit: interval, filter: allow_status });

        if (id_operator) {
            result.addSelect((qb) => this.getCountHistoryUreaded(qb, HistoryTypes.USER), 'ticket_unreaded_messages')
                .andWhere('ticket.id_operator = :idoperator', { idoperator: Number(id_operator) });
        }
        if (id_status) {
            result.andWhere('ticket.id_status = :idstatus', { idstatus: Number(id_status) });
        }

        if (id_service) {
            result.andWhere('ticket.id_service = :idservice', {idservice: id_service});
        }

        if (id_userdata) {
            result.andWhere('user.id_userdata = :iduserdata', {iduserdata: id_userdata});
        }

        return await result.orderBy('ticket.date_time', 'ASC').getMany();
    }

    public async findOne(idTicket: number, ticketServices: TicketServiceModel[], rel?: string[]): Promise<valueOrUndefined<Ticket>> {
        this.log.debug('Find one Ticket from ID: ', idTicket);
        return await this.ticketRepository.findOne({
            where: {
                id: idTicket,
                deleted: 0,
                id_service: In(extractServicesIdsFrom(ticketServices)),
            },
            relations: rel || [],
        });
    }

    public async findOneWith(idTicket: number, rel?: string[]): Promise<valueOrUndefined<Ticket>> {
        this.log.debug('Find one Ticket from ID: ', idTicket);
        return await this.ticketRepository.findOne({
            where: {
                id: idTicket,
                deleted: 0,
            },
            relations: rel || [],
        });
    }

    public async create(ticket: Ticket, userDataToFind?: UserDataTicket, phone?: string, rel: string[] = []): Promise<valueOrUndefined<Ticket>> {
        if (ticket.id) {
            return undefined;
        }

        ticket.id_status = (ticket.id_status) ? ticket.id_status : 1;
        delete ticket.date_time;

        if (userDataToFind) {
            const user: valueOrUndefined<User> = await this.userDataService.userWith(userDataToFind);
            if (user) {
                ticket.id_user = user.id;
            } else {
                const userUnknown: UserUnknown = (await this.userUnknownService.createIfNotExists(userDataToFind)) as UserUnknown;
                ticket.id_user_unknown = userUnknown.id;
            }
        }

        const newTicket: Ticket = await this.ticketRepository.save(ticket);
        if (phone) {
            const newTicketReport = new TicketReport();
            newTicketReport.id_ticket = newTicket.id;
            newTicketReport.number = phone;

            await this.ticketReportService.save([newTicketReport]);
        }
        const outputTicket = await this.ticketRepository.findOne(newTicket.id, {
            relations: rel,
        });
        this.eventDispatcher.dispatch(events.ticket.create, outputTicket);
        this.log.debug('Create a new Ticket: ', outputTicket);

        return outputTicket;
    }

    public async update(ticket: Ticket): Promise<valueOrUndefined<Ticket>> {
        ticket = ticketSanitize(ticket);

        const rel: string[] = [
            'category',
            'service',
            'status',
            'operator',
            'user',
            'historys',
            'userUnknown',
            'reports',
        ];
        const ticketFind: valueOrUndefined<Ticket> = await this.ticketRepository.findOne(ticket.id);
        if (!ticketFind) {
            throw new Error(`No ticket found with id: ${ticket.id}`);
        }
        if (ticket.id_status !== TicketStatuses.NEW && ticket.id_status !== TicketStatuses.ONLINE) {
            ticket.op_num_history = await this.ticketHistoryRepository.count({
                where: {
                    id_ticket: ticket.id,
                    id_type: HistoryTypes.OPERATOR,
                },
            });
            ticket.user_num_history = await this.ticketHistoryRepository.count({
                where: {
                    id_ticket: ticket.id,
                    id_type: HistoryTypes.USER,
                },
            });
        }
        this.log.debug('Update a Ticket: ', ticket);
        await this.ticketRepository.save(ticket);
        const outputTicket = await this.ticketRepository.findOne({
            where: {
                id: ticket.id,
            },
            relations: rel,
        });
        this.eventDispatcher.dispatch(events.ticket.updated, outputTicket);

        return outputTicket;
    }

    public async delete(id: number): Promise<valueOrUndefined<Ticket>> {
        const ticket: valueOrUndefined<Ticket> = await this.ticketRepository.findOne(id);
        if (!ticket) {
            return undefined;
        }
        ticket.deleted = 1;
        const newTicket = await this.ticketRepository.save(ticket);
        this.log.debug('delete a Ticket: ', newTicket);
        this.eventDispatcher.dispatch(events.ticket.deleted, newTicket);

        return newTicket;
    }

    public async isValid(ticket: Ticket): Promise<boolean> {
        const oldTicket = await this.ticketRepository.createQueryBuilder('ticket')
            .where('id_user = :idUser', { idUser: ticket.id_user })
            .andWhere('deleted = 0')
            .andWhere('ticket.date_time >= (NOW() - INTERVAL :limit MINUTE)', { limit: env.app.ticketTimeout })
            .orderBy('id', 'DESC')
            .getOne();

        this.log.debug('Test for isValid a Ticket: ', oldTicket);

        return (!!oldTicket) ? false : true;
    }


    public async findTicketOnlineWithUserData(userData: UserDataTicket, service: Services): Promise<valueOrUndefined<Ticket>> {
        return this.findTicketWithUserDataAndService(userData, service, TicketStatuses.ONLINE);
    }

    public findTicketNewedWithUserData(userData: UserDataTicket, service: Services): Promise<valueOrUndefined<Ticket>> {
        return this.findTicketWithUserDataAndService(userData, service, TicketStatuses.NEW);
    }

    private async findTicketWithUserDataAndService(userData: UserDataTicket, service: Services, status: number): Promise<valueOrUndefined<Ticket>> {
        this.log.debug('Find Ticket from UserData:', userData, 'and Service:', service, 'with status:', status);
        if (isEmpty(userData)) {
            return undefined;
        }

        let ticketRepositoryQuery = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('ticket.userUnknown', 'userUnknown')
            .leftJoinAndSelect('user.userdata', 'userdata')
            .where('ticket.deleted = false')
            .andWhere('ticket.id_status = :id_status', { id_status: status })
            .andWhere('ticket.id_service = :id_service', { id_service: service });

        if (userData.email) {
            ticketRepositoryQuery = ticketRepositoryQuery.andWhere('(userdata.email = :email or userUnknown.email = :email)', { email: userData.email });
        } else if (userData.phone) {
            ticketRepositoryQuery = ticketRepositoryQuery.andWhere('(userdata.phone = :phone or userUnknown.phone = :phone)', { phone: userData.phone });
        }

        return await ticketRepositoryQuery.getOne();

    }


    private getCountHistoryUreaded(qb: SelectQueryBuilder<any>, historyType: HistoryTypes): SelectQueryBuilder<any> {
        return qb.subQuery().from(TicketHistory, 'ticketHistory')
            .select('COUNT(*)', 'number')
            .where('id_ticket = ticket_id')
            .andWhere(`id_type = ${historyType}`)
            .andWhere('readed = 0')
            .groupBy(' id_ticket');
    }


}
