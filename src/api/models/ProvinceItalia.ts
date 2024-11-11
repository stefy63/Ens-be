import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { RegioniItalia } from './RegioniItalia';
import { ComuniItalia } from './ComuniItalia';
import { IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity('ens2_province')
export class ProvinceItalia {

    @IsOptional()
    @PrimaryGeneratedColumn()
    public id: number;

    @IsString()
    @Column()
    public nome: string;

    @IsNumber()
    @Column()
    public id_regione: number;

    @IsOptional()
    @IsNumber()
    @Column()
    public codice_citta_metropolitana: number;

    @IsString()
    @Column()
    public sigla_automobilistica: string;

    @IsNumber()
    @Column()
    public latitudine: number;

    @IsNumber()
    @Column()
    public longitudine: number;

    @ValidateNested()
    @Type(() => RegioniItalia)
    @OneToOne(type => RegioniItalia)
    @JoinColumn({
        name: 'id_regione',
        referencedColumnName: 'id',
    })
    public regione: RegioniItalia;

    @ValidateNested({each: true})
    @Type(() => ComuniItalia)
    @OneToMany(type => ComuniItalia, comuni => comuni.provincia) // specify inverse side as a second parameter
    public comuni: ComuniItalia[];
}
