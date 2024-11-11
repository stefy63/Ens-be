import { Ticket } from "./Ticket";
import { Entity, Column } from "typeorm";

@Entity('ens2_ticket')
export class TicketItemList extends Ticket {
    @Column({
        default: 0,
        nullable: true,
        select: false,
        readonly: true,
    })
    public unreaded_messages: number;
}
