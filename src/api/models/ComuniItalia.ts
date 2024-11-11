import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ProvinceItalia } from './ProvinceItalia';
import { RegioniItalia } from './RegioniItalia';
import { IsOptional, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_comuni')
export class ComuniItalia {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public nome: string;

    @IsNumber()
    @Column()
    public id_provincia: number;

    @IsNumber()
    @Column()
    public id_regione: number;

    @IsOptional()
    @IsNumber()
    @Column()
    public capoluogo_provincia: boolean;

    @IsString()
    @Column()
    public codice_catastale: string;

    @IsNumber()
    @Column()
    public latitudine: number;

    @IsNumber()
    @Column()
    public longitudine: number;

    @ValidateNested()
    @Type(() => ProvinceItalia)
    @OneToOne(type => ProvinceItalia)
    @JoinColumn({
        name: 'id_provincia',
        referencedColumnName: 'id',
    })
    public provincia: ProvinceItalia;

    @ValidateNested()
    @Type(() => RegioniItalia)
    @OneToOne(type => RegioniItalia)
    @JoinColumn({
        name: 'id_regione',
        referencedColumnName: 'id',
    })
    public regione: RegioniItalia;
}
