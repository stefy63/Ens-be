import { IsNumber, IsOptional, IsDateString } from "class-validator";

export class TicketExportReportRequest {
    @IsOptional()
    @IsNumber()
    public id_office?: number;

    @IsOptional()
    @IsNumber()
    public id_service?: number;
    
    @IsOptional()
    @IsNumber()
    public category?: number;

    @IsOptional()
    @IsNumber()
    public phone?: number;

    @IsOptional()
    @IsDateString()
    public date_start?: Date;

    @IsOptional()
    @IsDateString()
    public date_end?: Date;

    @IsOptional()
    @IsNumber()
    public status?: number;
}
