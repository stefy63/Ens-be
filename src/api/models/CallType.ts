import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

@Entity('ens2_call_type')
export class CallType {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public type: string;

}
