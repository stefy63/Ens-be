import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { IsNotEmpty, ValidateNested, IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { Ticket } from './Ticket';
import { TicketHistoryType } from './TicketHistoryType';
import { TicketHistoryAttachment } from './TicketHistoryAttachments';
import { Type } from 'class-transformer';

@Entity('ens2_ticket_history')
export class TicketHistory {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_ticket: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_type: number;

    @IsString()
    @IsNotEmpty()
    @Column()
    public action: string;

    @IsOptional()
    @IsDateString()
    @Column({ type: 'datetime' })
    public date_time: Date;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public readed: number;

    @ValidateNested()
    @Type(() => TicketHistoryType)
    @OneToOne(type => TicketHistoryType, { eager: true })
    @JoinColumn({
        name: 'id_type',
        referencedColumnName: 'id',
    })
    public type: TicketHistoryType;

    @ValidateNested()
    @Type(() => Ticket)
    @ManyToOne(type => Ticket, ticket => ticket.historys)
    @JoinColumn({
        name: 'id_ticket',
        referencedColumnName: 'id',
    })
    public ticket: Ticket;

    @ValidateNested({each: true})
    @Type(() => TicketHistoryAttachment)
    @OneToMany(type => TicketHistoryAttachment, history => history.ticketHistory, { eager: true })
    public attachments: TicketHistoryAttachment[];

    public toString(): string {
        return `${this.action}`;
    }

}
