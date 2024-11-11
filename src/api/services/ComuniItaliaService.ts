import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ComuniItaliaRepository } from '../repositories/ComuniItaliaRepository';
import { ComuniItalia } from '../models/ComuniItalia';
import { valueOrUndefined } from '../types/ValueOrUndefined';

@Service()
export class ComuniItaliaService {

    constructor(
        @OrmRepository() private comuniItaliaRepository: ComuniItaliaRepository
    ) { }

    public async getAll(): Promise<ComuniItalia[]> {
        return await this.comuniItaliaRepository.find();
    }

    public async findOne(idComune: number): Promise<valueOrUndefined<ComuniItalia>> {
        return await this.comuniItaliaRepository.findOne({ where: { id: idComune }, relations: ['regione', 'provincia'] });
    }
}
