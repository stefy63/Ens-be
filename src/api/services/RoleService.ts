import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { RoleRepository } from '../repositories/RoleRepository';
import { Roles } from '../models/Roles';

@Service()
export class RoleService {
    constructor(
        @OrmRepository() private roleRepository: RoleRepository
    ) { }

    public getAll(): Promise<Roles[]> {
        return this.roleRepository.find();
    }
}
