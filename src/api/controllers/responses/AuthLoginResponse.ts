import { TokenSession } from '../../models/TokenSession';
import { User } from '../../models/User';
import { TicketStatus } from '../../models/TicketStatus';
import { TicketService } from '../../services/TicketService';
import { TicketCategory } from '../../models/TicketCategory';
import { TicketHistoryType } from '../../models/TicketHistoryType';
import { DefaultDialog } from '../../models/DefaultDialog';
import { CallType } from '../../models/CallType';
import { CallResult } from '../../models/CallResult';
import { Offices } from '../../models/Offices';
import { IsJSON } from 'class-validator';

export class AuthLoginResponse {

    @IsJSON()
    public token: TokenSession;

    @IsJSON()
    public user: User;

    @IsJSON()
    public ticket_status: TicketStatus;

    @IsJSON()
    public ticket_service: TicketService;

    @IsJSON()
    public ticket_category: TicketCategory;

    @IsJSON()
    public ticket_history_type: TicketHistoryType;

    @IsJSON()
    public default_dialog: DefaultDialog;

    @IsJSON()
    public call_type: CallType;

    @IsJSON()
    public call_result: CallResult;

    @IsJSON()
    public services: TicketService;

    @IsJSON()
    public offices: Offices;
}
