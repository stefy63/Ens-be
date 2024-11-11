import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';


@Entity('ens2_office')
export class Offices {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public office: string;

}
