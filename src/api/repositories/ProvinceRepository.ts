import { Repository, EntityRepository } from 'typeorm';
import { ProvinceItalia } from '../models/ProvinceItalia';

@EntityRepository(ProvinceItalia)
export class ProvinceItaliaRepository extends Repository<ProvinceItalia>  {

}
