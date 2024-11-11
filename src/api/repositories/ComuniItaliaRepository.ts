import { Repository, EntityRepository } from 'typeorm';
import { ComuniItalia } from '../models/ComuniItalia';

@EntityRepository(ComuniItalia)
export class ComuniItaliaRepository extends Repository<ComuniItalia>  {

}
