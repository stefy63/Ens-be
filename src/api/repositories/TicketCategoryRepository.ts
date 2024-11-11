import { Repository, EntityRepository } from 'typeorm';
import { TicketCategory } from '../models/TicketCategory';

@EntityRepository(TicketCategory)
export class TicketCategoryRepository extends Repository<TicketCategory>  {

}
