import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { IsNotEmpty, IsOptional, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Ticket } from './Ticket';
import { Type } from 'class-transformer';

@Entity('ens2_ticket_report')
export class TicketReport {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_ticket: number;

    @IsString()
    @IsNotEmpty()
    @Column()
    public number: string;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_call_type: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_call_result: number;

    @ValidateNested()
    @Type(() => Ticket)
    @ManyToOne(type => Ticket, ticket => ticket.reports)
    @JoinColumn({
        name: 'id_ticket',
        referencedColumnName: 'id',
    })
    public ticket: Ticket;

}
