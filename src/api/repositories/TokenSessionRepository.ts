import { Repository, EntityRepository } from 'typeorm';
import { TokenSession } from '../models/TokenSession';

@EntityRepository(TokenSession)
export class TokenSessionRepository extends Repository<TokenSession>  {

}
