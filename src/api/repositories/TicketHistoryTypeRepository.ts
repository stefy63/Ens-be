import { Repository, EntityRepository } from 'typeorm';
import { TicketHistoryType } from '../models/TicketHistoryType';

@EntityRepository(TicketHistoryType)
export class TicketHistoryTypeRepository extends Repository<TicketHistoryType>  {

}
