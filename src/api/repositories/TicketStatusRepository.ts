import { Repository, EntityRepository } from 'typeorm';
import { TicketStatus } from '../models/TicketStatus';

@EntityRepository(TicketStatus)
export class TicketStatusRepository extends Repository<TicketStatus>  {

}
