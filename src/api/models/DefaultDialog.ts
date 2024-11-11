import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';


@Entity('ens_dialoghi')
export class DefaultDialog {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @IsString()
    @Column({ length: 10 })
    public code_msg: string;

    @IsNumber()
    @Column()
    public ordine: number;

    @IsNotEmpty()
    @IsString()
    @Column({ length: 100 })
    public description: string;

}
