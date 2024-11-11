import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { OfficeRepository } from '../repositories/OfficeRepository';
import { Offices } from '../models/Offices';

@Service()
export class OfficeService {
    constructor(
        @OrmRepository() private officeRepository: OfficeRepository
    ) { }

    public getAll(): Promise<Offices[]> {
        return this.officeRepository.find();
    }
}
