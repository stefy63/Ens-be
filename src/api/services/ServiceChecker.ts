import { find, get } from "lodash";
import { TicketService } from 'src/api/models/TicketService';
import { Service } from "typedi";
import { User } from "../models/User";
import { Services } from '../enums/TicketServices.enum';

@Service('ServiceChecker')
export class ServiceChecker {
    public async userHas(user: User, service: Services): Promise<boolean> {
        const services: TicketService[] = get(user, 'services', []);
        return !!find(services, (s: TicketService) => {
            return s.id === service;
        });
    }
}
