import { Repository, EntityRepository } from 'typeorm';
import { UserData } from "../models/UserData";

@EntityRepository(UserData)
export class UserDataRepository extends Repository<UserData>  {

}
