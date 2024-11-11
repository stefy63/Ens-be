import {Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column} from 'typeorm';
import { Permissions } from './Permissions';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_role')
export class Roles {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public name: string;

    @IsString()
    @Column()
    public description: string;

    @IsString()
    @Column()
    public portal: string;

    @ValidateNested({each: true})
    @Type(() => Permissions)
    @ManyToMany(type => Permissions, permission => permission.roles, { eager: true })
    @JoinTable({
        name: 'ens2_roleToPermissions',
        joinColumns: [{ name: 'id_role'}],
        inverseJoinColumns: [
            { name: 'id_permission' },
        ],
    })
    public permissions: Permissions[];


}
