import { Repository, EntityRepository } from 'typeorm';
import { CallType } from '../models/CallType';

@EntityRepository(CallType)
export class CallTypeRepository extends Repository<CallType>  {

}
