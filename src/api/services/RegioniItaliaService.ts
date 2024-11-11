import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { RegioniItaliaRepository } from '../repositories/RegioniRepository';
import { RegioniItalia } from '../models/RegioniItalia';
import { valueOrUndefined } from '../types/ValueOrUndefined';

@Service()
export class RegioniItaliaService {

    constructor(
        @OrmRepository() private regioniItaliaRepository: RegioniItaliaRepository
    ) { }

    public async getAll(): Promise<RegioniItalia[]> {
        return await this.regioniItaliaRepository.find();
    }

    public async findOne(idRegione: number): Promise<valueOrUndefined<RegioniItalia>> {
        return await this.regioniItaliaRepository.findOne({ where: { id: idRegione } });
    }
}
