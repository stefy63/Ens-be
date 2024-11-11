import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('ens2_ticket_history_type')
export class TicketHistoryType {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @IsNotEmpty()
    @Column({ length: 50 })
    public type: string;

    public toString(): string {
        return `${this.type}`;
    }

}
