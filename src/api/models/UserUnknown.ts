import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

@Entity('ens2_user_unknown')
export class UserUnknown {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsOptional()
    @IsString()
    @Column()
    public email: string;

    @IsOptional()
    @IsString()
    @Column()
    public phone: string;
}
