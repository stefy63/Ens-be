import { Repository, EntityRepository } from 'typeorm';
import { TicketHistory } from '../models/TicketHistory';

@EntityRepository(TicketHistory)
export class TicketHistoryRepository extends Repository<TicketHistory>  {

}
