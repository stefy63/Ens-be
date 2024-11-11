import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { UserData } from './UserData';
import { Roles } from './Roles';
import { Offices } from './Offices';
import { TicketService } from './TicketService';
import { TokenSession } from './TokenSession';
import { IsNumber, IsString, IsOptional, IsBoolean, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_user')
export class User {

    @IsOptional()
    @IsNumber()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNumber()
    @Column()
    public id_userdata: number;

    @IsString()
    @Column()
    public username: string;

    @IsOptional()
    @IsString()
    @Column()
    public password: string;

    @IsBoolean()
    @Column()
    public isOperator: boolean;

    @IsBoolean()
    @Column()
    public isOnline: boolean;

    @IsOptional()
    @IsBoolean()
    @Column()
    public disabled: boolean;

    @IsDateString()
    @Column({ type: 'datetime' })
    public date_creation: Date;

    @IsOptional()
    @IsDateString()
    @Column({ type: 'datetime' })
    public date_update: Date;

    @IsOptional()
    @IsNumber()
    @Column()
    public id_role: number;

    @IsOptional()
    @IsNumber()
    @Column({
        nullable: true,
    })
    public id_office: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => TokenSession)
    @OneToOne(type => TokenSession)
    @JoinColumn({
         name: 'id',
         referencedColumnName: 'id_user',
    })
    public token: TokenSession;

    @IsOptional()
    @ValidateNested()
    @Type(() => UserData)
    @OneToOne(type => UserData, { eager: true })
    @JoinColumn({
        name: 'id_userdata',
        referencedColumnName: 'id',
    })
    public userdata: UserData;

    @ValidateNested()
    @Type(() => Roles)
    @OneToOne(type => Roles, { eager: true })
    @JoinColumn({
        name: 'id_role',
        referencedColumnName: 'id',
    })
    public role: Roles;

    @IsOptional()
    @ValidateNested()
    @Type(() => Offices)
    @OneToOne(type => Offices, { eager: true })
    @JoinColumn({
        name: 'id_office',
        referencedColumnName: 'id',
    })
    public office: Offices;

    @ValidateNested({each: true})
    @Type(() => TicketService)
    @ManyToMany(type => TicketService, { eager: true })
    @JoinTable({
        name: 'ens2_userToServices',
        joinColumns: [{ name: 'id_user'}],
        inverseJoinColumns: [{ name: 'id_service' }],
    })
    public services: TicketService[];
}
