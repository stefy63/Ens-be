import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProvinceItaliaRepository } from '../repositories/ProvinceRepository';
import { ProvinceItalia } from '../models/ProvinceItalia';
import { valueOrUndefined } from '../types/ValueOrUndefined';

@Service()
export class ProvinceItaliaService {

    constructor(
        @OrmRepository() private provinceItaliaRepository: ProvinceItaliaRepository
    ) { }

    public async getAll(): Promise<ProvinceItalia[]> {
        return await this.provinceItaliaRepository.find();
    }

    public async findOne(idProvincia: number): Promise<valueOrUndefined<ProvinceItalia>> {
        return await this.provinceItaliaRepository.findOne({ where: { id: idProvincia }, relations: ['regione'] });
    }
}
