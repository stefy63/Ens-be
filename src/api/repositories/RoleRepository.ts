import { Repository, EntityRepository } from 'typeorm';
import { Roles } from '../models/Roles';

@EntityRepository(Roles)
export class RoleRepository extends Repository<Roles> {
}
