import { JsonController, Get, Param, HttpError } from 'routing-controllers';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TicketServiceService } from '../services/TicketServiceService';
import { TicketService } from '../models/TicketService';


@JsonController('/ticket-service')
export class TicketServiceController {

    constructor(
        private ticketServiceService: TicketServiceService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Get()
    @ResponseSchema(TicketService, {isArray: true})
    public async find(): Promise<TicketService[]> {
        const ticketService: TicketService[] = await this.ticketServiceService.find();
        this.log.info(`TicketService Find return successfully. Service: ${ticketService}`);
        return ticketService;
    }

    @Get('/:id')
    @ResponseSchema(TicketService, {isArray: true})
    public async findById(@Param('id') id: number): Promise<TicketService> {
        const ticketService: TicketService | undefined = await this.ticketServiceService.findById(id);
        if (!ticketService) {
            this.log.error('Service by ID not found.', id);
            throw new HttpError(404, 'SERVICE_NOT_FOUND');
        }
        this.log.info(`TicketService By ID Find return successfully. Service: ${ticketService}`);
        return ticketService;
    }

}
