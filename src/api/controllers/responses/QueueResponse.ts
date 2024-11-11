import { IsNumber } from "class-validator";

export class QueueResponse {
    @IsNumber()
    public operatorActive: number;

    @IsNumber()
    public operatorBusy: number;

    @IsNumber()
    public ticketInWaiting: number;
}
