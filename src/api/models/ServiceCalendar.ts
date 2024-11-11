import {Entity, ManyToOne, JoinColumn, Column, PrimaryColumn} from 'typeorm';
import { TicketService } from './TicketService';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_service_calendar')
export class ServiceCalendar {

    @IsOptional()
    @PrimaryColumn()
    public id: number;

    @IsNumber()
    @Column()
    public id_service: number;

    @IsOptional()
    @IsNumber()
    @Column({ type: 'time' })
    public time_start: Date;

    @IsOptional()
    @IsNumber()
    @Column({ type: 'time' })
    public time_end: Date;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public weekday_start: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public weekday_end: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public monthday_start: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public monthday_end: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public month_start: number;

    @IsOptional()
    @IsNumber()
    @Column({ default: 0 })
    public month_end: number;

    @ValidateNested()
    @Type(() => TicketService)
    @ManyToOne(type => TicketService, service => service.calendars)
    @JoinColumn({
        name: 'id_service',
        referencedColumnName: 'id',
    })
    public service: TicketService;
}
