import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { ServiceCalendar } from './ServiceCalendar';
import { Type } from 'class-transformer';


@Entity('ens2_ticket_service')
export class TicketService {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @IsNotEmpty()
    @Column({ length: 50 })
    public service: string;

    @IsOptional()
    @IsString()
    @Column({  type: "text"})
    public description: string;

    @IsOptional()
    @IsBoolean()
    @Column({ default: false })
    public deleted: boolean;

    @ValidateNested({each: true})
    @Type(() => ServiceCalendar)
    @OneToMany(type => ServiceCalendar, calendar => calendar.service)
    public calendars: ServiceCalendar[];

}
