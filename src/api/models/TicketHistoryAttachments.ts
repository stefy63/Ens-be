import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsNumber, IsString, ValidateNested } from 'class-validator';
import { TicketHistory } from './TicketHistory';
import { Type } from 'class-transformer';


@Entity('ens2_ticket_history_attachment')
export class TicketHistoryAttachment {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    public id_ticket_history: number;

    @IsString()
    @IsNotEmpty()
    @Column()
    public path: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    public name: string;

    @ValidateNested()
    @Type(() => TicketHistory)
    @ManyToOne(type => TicketHistory, ticket => ticket.attachments)
    @JoinColumn({
        name: 'id_ticket_history',
        referencedColumnName: 'id',
    })
    public ticketHistory: TicketHistory;

    public toString(): string {
        return `${this.id}`;
    }

}
