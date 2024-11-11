import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InnerQueryRequest {
    @IsOptional()
    @IsNumber()
    public id_category?: number;
    
    @IsOptional()
    @IsNumber()
    public mapped?: number;

    @IsOptional()
    @IsNumber()
    public id_status: number;

    @IsOptional()
    @IsNumber()
    public id_user: number;

    @IsOptional()
    @IsNumber()
    public id_service: number;

    @IsOptional()
    @IsNumber()
    public id_userdata: number;

    @IsOptional()
    @IsString()
    public phone: string;
}

// tslint:disable-next-line:max-classes-per-file
export class FilteredTicketRequest {
    public query?: InnerQueryRequest;
    
}
