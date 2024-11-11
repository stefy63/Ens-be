import { Service } from 'typedi';
import { FindManyOptions, SaveOptions } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Services } from '../enums/TicketServices.enum';
import { ServiceCalendar } from '../models/ServiceCalendar';
import { ServiceCalendarRepository } from '../repositories/ServiceCalendar';
import { events } from '../subscribers/events';
import { valueOrUndefined } from '../types/ValueOrUndefined';


@Service()
export class ServiceCalendarService {

    constructor(
        @OrmRepository() private serviceCalendarRepository: ServiceCalendarRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public async find(options?: FindManyOptions): Promise<ServiceCalendar[]> {
        const calendar = await this.serviceCalendarRepository.find(options);
        this.log.debug('Find calendar: ', calendar);
        return calendar;
    }

    public async create(calendar: ServiceCalendar): Promise<valueOrUndefined<ServiceCalendar>> {
        if (!calendar.id_service || !calendar.time_start || !calendar.time_end) {
            return undefined;
        }
        const outputCalendar: ServiceCalendar = await this.serviceCalendarRepository.save(calendar);
        this.eventDispatcher.dispatch(events.calendar.create, outputCalendar);
        this.log.debug('Create a new Calendar: ', outputCalendar);

        return outputCalendar;
    }

    public async update(calendar: ServiceCalendar, options?: SaveOptions): Promise<valueOrUndefined<ServiceCalendar>>  {
        const calendarFind: valueOrUndefined<ServiceCalendar> = await this.serviceCalendarRepository.findOne(calendar.id);
        if (!calendarFind) {
            return undefined;
        }
        await this.serviceCalendarRepository.save(calendar, options);
        const outputCalendar = await this.serviceCalendarRepository.findOne(calendar.id);
        this.eventDispatcher.dispatch(events.calendar.updated, outputCalendar);
        this.log.debug('Update a Calendar: ', outputCalendar);
        return outputCalendar;
    }

    public async updateChannel(channel: number, calendar: ServiceCalendar[], options?: SaveOptions): Promise<valueOrUndefined<ServiceCalendar[]>>  {

        await this.serviceCalendarRepository.createQueryBuilder()
                    .delete()
                    .where('id_service = :id', {id: channel})
                    .execute();
        await this.serviceCalendarRepository.save(calendar);
        const outputCalendar: ServiceCalendar[] = await this.serviceCalendarRepository.find({
            relations: ['service'],
            where: {
                id_service: channel,
            },
        });

        this.log.debug('Update a Calendar for Channel: ' + Services[channel], outputCalendar);
        return outputCalendar;
    }


    public async delete(id: number): Promise<boolean | undefined>  {

        const calendar: valueOrUndefined<ServiceCalendar> = await this.serviceCalendarRepository.findOne(id);
        if (!calendar) {
            return undefined;
        }
        await this.serviceCalendarRepository.delete(id);
        this.log.debug('delete a Calendar: ', calendar);
        this.eventDispatcher.dispatch(events.ticket.deleted, calendar);
        return true;
    }


    public async isOpen(idService: number): Promise<boolean> {

        const calendar = await this.serviceCalendarRepository
            .createQueryBuilder('serviceCalendar')
            .where('id_service = :id', { id: idService })
            .andWhere('TIME(NOW()) BETWEEN time_start AND time_end')
            .andWhere ('WEEKDAY(NOW()) BETWEEN serviceCalendar.weekday_start AND serviceCalendar.weekday_end')
            .getOne();

        this.log.debug(`Get isOpen serviceID ${idService}: `, calendar);
        return !!calendar;
    }

}
