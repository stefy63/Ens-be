import { Repository, EntityRepository } from 'typeorm';
import { RegioniItalia } from '../models/RegioniItalia';

@EntityRepository(RegioniItalia)
export class RegioniItaliaRepository extends Repository<RegioniItalia>  {

}
