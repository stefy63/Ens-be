import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';


@Entity('ens2_ticket_category')
export class TicketCategory {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @IsNotEmpty()
    @Column({ length: 50 })
    public category: string;

    @IsOptional()
    @IsBoolean()
    @Column({ default: false })
    public deleted: boolean;

    public toString(): string {
        return `${this.category}`;
    }

}
