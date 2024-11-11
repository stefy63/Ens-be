import { IsNumber, IsString } from 'class-validator';


export class TicketReportTypeRequest {
    
    @IsNumber()
    public id?: number;

    @IsNumber()
    public id_ticket: number;

    @IsString()
    public  number: string;

    @IsNumber()
    public id_call_type?: number;

    @IsNumber()
    public id_call_result?: number;
}
