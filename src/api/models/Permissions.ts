import { Entity, PrimaryColumn, Column, ManyToMany } from "typeorm";
import { Roles } from "./Roles";
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_permission')
export class Permissions {

    @IsOptional()
    @PrimaryColumn()
    public id: number;

    @IsString()
    @Column()
    public action: string;

    @ValidateNested({each: true})
    @Type(() => Roles)
    @ManyToMany(type => Roles, role => role.permissions)
    public roles: Roles[];
}
