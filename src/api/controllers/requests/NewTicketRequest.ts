import { IsNumber, IsString } from 'class-validator';

export class NewTicketRequest {
    @IsNumber()
    public id_service: number;

    @IsNumber()
    public id_category: number;
    
    @IsString()
    public phone: string;
}
