import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDateString, ValidateNested } from 'class-validator';
import { User } from './User';
import { Type } from 'class-transformer';

@Entity('ens2_token_session')
export class TokenSession {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsOptional()
    @IsNumber()
    @Column()
    public id_user: number;

    @IsString()
    @IsNotEmpty()
    @Column({ length: 50 })
    public token_session: string;

    @IsDateString()
    @IsNotEmpty()
    @Column({ type: 'datetime' })
    public token_expire_date: Date;

    @ValidateNested()
    @Type(() => User)
    @OneToOne(type => User, { eager: true })
    @JoinColumn({
        name: 'id_user',
        referencedColumnName: 'id',
    })
    public user: User;

}
