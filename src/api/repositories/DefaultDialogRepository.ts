import { Repository, EntityRepository } from 'typeorm';
import { DefaultDialog } from '../models/DefaultDialog';

@EntityRepository(DefaultDialog)
export class DefaultDialogRepository extends Repository<DefaultDialog>  {

}
