import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


@Entity('ens2_ticket_status')
export class TicketStatus {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @IsNotEmpty()
    @Column({ length: 50 })
    public status: string;

    public toString(): string {
        return `${this.status}`;
    }

}
