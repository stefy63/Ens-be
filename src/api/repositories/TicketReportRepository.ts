import { Repository, EntityRepository } from 'typeorm';
import { TicketReport } from '../models/TicketReport';

@EntityRepository(TicketReport)
export class TicketReportRepository extends Repository<TicketReport>  {

}
