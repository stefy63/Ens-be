import { JsonController, Authorized, Get } from 'routing-controllers';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { ResponseSchema } from 'routing-controllers-openapi';
import { RoleService } from '../services/RoleService';
import { RoleResponse } from './responses/RoleResponse';
import { Roles } from '../models/Roles';

@JsonController('/roles')
export class RolesController {
    constructor(
        private roleService: RoleService
    ) { }


    @Authorized()
    @Get("/")
    @ResponseSchema(RoleResponse, {isArray: true})
    public async getRole(): Promise<valueOrUndefined<Roles[]>> {
        return await this.roleService.getAll();
    }

}
