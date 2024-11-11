import { Repository, EntityRepository } from 'typeorm';
import { Ticket } from '../models/Ticket';

@EntityRepository(Ticket)
export class TicketRepository extends Repository<Ticket>  {

}
