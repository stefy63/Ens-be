import { Repository, EntityRepository } from 'typeorm';
import { TicketService } from '../models/TicketService';

@EntityRepository(TicketService)
export class TicketServiceRepository extends Repository<TicketService>  {

}
