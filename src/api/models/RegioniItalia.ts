import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProvinceItalia } from './ProvinceItalia';
import { ComuniItalia } from './ComuniItalia';
import { IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_regioni')
export class RegioniItalia {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public nome: string;

    @IsNumber()
    @Column()
    public latitudine: number;

    @IsNumber()
    @Column()
    public longitudine: number;

    @ValidateNested({each: true})
    @Type(() => ProvinceItalia)
    @OneToMany(type => ProvinceItalia, province => province.regione)
    public province: ProvinceItalia[];

    @ValidateNested({each: true})
    @Type(() => ComuniItalia)
    @OneToMany(type => ComuniItalia, comuni => comuni.regione)
    public comuni: ComuniItalia[];

}
