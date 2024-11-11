import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { IsOptional, IsString, IsDateString, IsBoolean, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


@Entity('ens2_user_data')
export class UserData {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public name: string;

    @IsString()
    @Column()
    public surname: string;

    @IsOptional()
    @IsDateString()
    @Column({ type: 'datetime' })
    public born_date: Date;

    @IsOptional()
    @IsString()
    @Column()
    public born_city: string;

    @IsOptional()
    @IsNumber()
    @Column()
    public born_province: number;

    @IsString()
    @Column()
    public email: string;

    @IsOptional()
    @IsString()
    @Column()
    public gender: number;

    @IsOptional()
    @IsString()
    @Column()
    public city: string;

    @IsOptional()
    @IsString()
    @Column()
    public address: string;

    @IsOptional()
    @IsNumber()
    @Column()
    public province: number;

    @IsOptional()
    @IsString()
    @Column()
    public phone: string;

    @IsOptional()
    @IsString()
    @Column()
    public card_number: string;

    @IsOptional()
    @IsString()
    @Column()
    public fiscalcode: string;

    @IsOptional()
    @IsBoolean()
    @Column()
    public privacyaccept: boolean;

    @IsOptional()
    @IsBoolean()
    @Column()
    public newsletteraccept: boolean;

    @IsOptional()
    @IsBoolean()
    @Column()
    public becontacted: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => User)
    @OneToOne(type => User)
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'id_userdata',
    })
    public user: User;

}
