import { Repository, EntityRepository } from 'typeorm';
import { User } from '../models/User';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import {valueOrUndefined} from '../types/ValueOrUndefined';

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

    public async withoutLoginCredentials(options?: FindOneOptions<User>): Promise<valueOrUndefined<User>> {
        const user = await this.findOne(options);
        return user;
    }


}
