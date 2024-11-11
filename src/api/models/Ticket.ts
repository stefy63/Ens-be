import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import {TicketCategory} from './TicketCategory';
import { TicketService } from './TicketService';
import { TicketStatus } from './TicketStatus';
import { User } from './User';
import { TicketHistory } from './TicketHistory';
import { UserUnknown } from "./UserUnknown";
import { TicketReport } from './TicketReport';
import { Type } from 'class-transformer';

@Entity('ens2_ticket')
export class Ticket {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNumber()
    @Column()
    public id_service: number;

    @IsOptional()
    @IsNumber()
    @Column()
    public id_operator: number;

    @IsOptional()
    @IsNumber()
    @Column()
    public id_user: number;

    @IsOptional()
    @IsNumber()
    @Column()
    public id_user_unknown: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_status: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 1 })
    public id_category: number;

    @IsOptional()
    @IsDateString()
    @Column({ type: 'datetime' })
    public date_time: Date;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public closed: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public op_num_history: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public user_num_history: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public deleted: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => TicketCategory)
    @OneToOne(type => TicketCategory)
    @JoinColumn({ name: 'id_category' })
    public category: TicketCategory;

    @IsOptional()
    @ValidateNested()
    @Type(() => TicketService)
    @OneToOne(type => TicketService)
    @JoinColumn({ name: 'id_service' })
    public service: TicketService;

    @IsOptional()
    @ValidateNested()
    @Type(() => TicketStatus)
    @OneToOne(type => TicketStatus)
    @JoinColumn({ name: 'id_status' })
    public status: TicketStatus;

    @IsOptional()
    @ValidateNested()
    @Type(() => User)
    @OneToOne(type => User)
    @JoinColumn({ name: 'id_operator' })
    public operator: User;

    @IsOptional()
    @ValidateNested()
    @Type(() => User)
    @OneToOne(type => User)
    @JoinColumn({ name: 'id_user' })
    public user: User;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => TicketHistory)
    @OneToMany(type => TicketHistory, history => history.ticket)
    public historys: TicketHistory[];

    @IsOptional()
    @ValidateNested()
    @Type(() => UserUnknown)
    @OneToOne(type => UserUnknown)
    @JoinColumn({ name: 'id_user_unknown' })
    public userUnknown: UserUnknown;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => TicketReport)
    @OneToMany(type => TicketReport, report => report.ticket)
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'id_ticket',
    })
    public reports: TicketReport[];
}
