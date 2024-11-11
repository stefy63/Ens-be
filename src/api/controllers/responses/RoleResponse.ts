import { IsNumber, IsString } from "class-validator";
import { RolePortalType } from "../../enums/RolePortal.enum";

export class RoleResponse {
    @IsNumber()
    public id: number;

    @IsString()
    public name: string;

    @IsString()
    public description: string;

    @IsString()
    public portal: RolePortalType;
}
