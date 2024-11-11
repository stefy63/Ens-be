import { Repository, EntityRepository } from 'typeorm';
import { UserUnknown } from '../models/UserUnknown';

@EntityRepository(UserUnknown)
export class UserUnknownRepository extends Repository<UserUnknown>  {

}
