import { TicketService } from '../models/TicketService';
import { map } from 'lodash';

export function extractServicesIdsFrom(services: TicketService[]): number[] {
    return (services.length === 0) ? [-99] : map(services, (service: TicketService) => service.id);
}
