import { Repository, EntityRepository } from 'typeorm';
import { CallResult } from '../models/CallResult';

@EntityRepository(CallResult)
export class CallResultRepository extends Repository<CallResult>  {

}
