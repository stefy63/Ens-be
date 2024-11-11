import { JsonController, Authorized, Get, Post, Body, Put, Param, HttpError } from 'routing-controllers';
import {ServiceCalendar} from '../models/ServiceCalendar';
import {ServiceCalendarService} from '../services/ServiceCalendarService';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ValidatorApplier } from "../validators/ValidatorApplier";
import { assign } from "lodash";
import { ResponseSchema } from 'routing-controllers-openapi';
import { TicketServiceService } from '../services/TicketServiceService';
import { TicketService } from '../models/TicketService';


@JsonController('/calendar')
export class ServiceCalendarController {

    constructor(
        private serviceCalendarService: ServiceCalendarService,
        private ticketServiceService: TicketServiceService,
        private validatorApplier: ValidatorApplier,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Authorized()
    @Get()
    @ResponseSchema(ServiceCalendar, {isArray: true})
    public async find(): Promise<ServiceCalendar[]> {
        const calendar: ServiceCalendar[] = await this.serviceCalendarService.find({relations: ['service']});
        this.log.info(`Calendar Find return successfully. Calendar: ${calendar}`);
        return calendar;
    }

    @Authorized('service.update.all')
    @Get('/service/:id_service(\\d+)/')
    @ResponseSchema(ServiceCalendar, {isArray: true})
    public async findFromService(@Param('id_service') id_service: number): Promise<ServiceCalendar[]> {
        const calendar: ServiceCalendar[] = await this.serviceCalendarService.find({
            relations: ['service'],
            where: {
                id_service,
            },
        });
        this.log.info(`Calendar Find From Service return successfully. Calendar: ${calendar}`);
        return calendar;
    }

    @Authorized()
    @Post()
    @ResponseSchema(ServiceCalendar)
    public async create(@Body() calendar: ServiceCalendar): Promise<valueOrUndefined<ServiceCalendar>> {
        calendar = assign(new ServiceCalendar(), calendar);
        await this.validatorApplier.apply<ServiceCalendar>(calendar);

        const newCalendar = await this.serviceCalendarService.create(calendar);
        this.log.info(`Calendar create successfully. Calendar: ${newCalendar}`);
        return newCalendar;
    }

    @Authorized('service.update.all')
    @Put('/:id')
    @ResponseSchema(ServiceCalendar)
    public async update(@Param('id') id: number, @Body() calendar: ServiceCalendar): Promise<valueOrUndefined<ServiceCalendar>> {
        calendar.id = id;

        calendar = assign(new ServiceCalendar(), calendar);
        await this.validatorApplier.apply<ServiceCalendar>(calendar);

        const newCalendar = await this.serviceCalendarService.update(calendar);
        this.log.info(`Calendar Update successfully. Calendar: ${newCalendar}`);
        return newCalendar;
    }

    @Authorized('service.update.all')
    @Put('/service/:id')
    @ResponseSchema(ServiceCalendar, {isArray: true})
    public async updateChannel(@Param('id') id: number, @Body() data: any): Promise<valueOrUndefined<ServiceCalendar[]>> {
        const calendar: ServiceCalendar[] = data.calendar;
        const description: string = data.description;
        await this.validatorApplier.apply<ServiceCalendar[]>(calendar);

        let service: TicketService | undefined = await this.ticketServiceService.findById(id);
        if (!service) {
            this.log.error(`Calendars Channel Update Failed. Calendars Channel: ${id}`);
            throw new HttpError(404, 'UPDATE_CALENDAR_FAULT');
        }
        await this.validatorApplier.apply<TicketService>(service);

        service.description = description;
        await this.ticketServiceService.update(service);

        const newCalendar = await this.serviceCalendarService.updateChannel(id, calendar);
        this.log.info(`Calendars Channel Update successfully. Calendars Channel: ${newCalendar}`);
        return newCalendar;
    }

    @Get('/:id')
    public async isActive(@Param('id') id: number): Promise<boolean> {
        const calendarID = await this.serviceCalendarService.isOpen(id);
        this.log.info(`Calendar Find Active successfully. Calendar ID: ${calendarID}`);
        return calendarID;
    }

}
