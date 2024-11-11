import { Repository, EntityRepository } from 'typeorm';
import { Offices } from "../models/Offices";

@EntityRepository(Offices)
export class OfficeRepository extends Repository<Offices> {
}
