import { Repository, EntityRepository } from 'typeorm';
import { ServiceCalendar } from '../models/ServiceCalendar';

@EntityRepository(ServiceCalendar)
export class ServiceCalendarRepository extends Repository<ServiceCalendar> {
}
