import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TicketStatuses } from '../enums/TicketStatuses.enum';
import { TicketRepository } from '../repositories/TicketRepository';
import { TokenSessionRepository } from '../repositories/TokenSessionRepository';


@Service()
export class QueueResultService {

    constructor(
        @OrmRepository() private tokenSessionRepository: TokenSessionRepository,
        @OrmRepository() private ticketRepository: TicketRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public getOperatorByService(id_service: number): Promise<number> {
        this.log.debug(`Get Operator in Queue by Service ID: `, id_service);
        return this.tokenSessionRepository
                .createQueryBuilder('tokensession')
                .innerJoinAndSelect("tokensession.user", "user", "user.isoperator = :isOperator", { isOperator: true })
                .innerJoinAndSelect("user.services", "service", "service.id = :idService", { idService: id_service })
                .where('tokensession.token_expire_date > NOW()') // TODO: check this implementation
                .andWhere('user.isOnline = 1')
                .getCount();
    }

    public async getTicketQueueByIdAndService(id: number, id_service: number): Promise<number> {
        this.log.debug(`Get Ticket in Queue by  Ticket ID: ${id} and service ${id_service}`);
        return this.ticketRepository
                .createQueryBuilder('ticket')
                .where('id_status = :idStatus AND id < :idTicket', { idStatus: TicketStatuses.NEW, idTicket: id })
                .andWhere('id_service = :idService', { idService: id_service })
                .andWhere('deleted=0')
                .getCount();
    }


    public async getOperatorBusyByService(id_service: number): Promise<number> {
        this.log.debug(`Get Operator Busy by Service in Queue by Service ID: `, id_service);
        return this.ticketRepository
                .createQueryBuilder('ticket')
                .select('DISTINCT ticket.id_operator')
                .innerJoinAndSelect('ticket.operator', 'operator')
                .innerJoinAndSelect("operator.services", "service", "service.id = :idService", { idService: id_service })
                .innerJoinAndSelect('operator.token', 'token')
                .where('ticket.id_status = :idStatus', { idStatus: TicketStatuses.ONLINE })
                .andWhere('operator.isOnline = 1')
                .andWhere('token.token_expire_date > NOW()')
                .groupBy('id_operator')
                .getCount();
    }
}
