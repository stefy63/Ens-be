import { Repository, EntityRepository } from 'typeorm';
import { TicketHistoryAttachment } from "../models/TicketHistoryAttachments";

@EntityRepository(TicketHistoryAttachment)
export class TicketHistoryAttachmentRepository extends Repository<TicketHistoryAttachment>  {

}
