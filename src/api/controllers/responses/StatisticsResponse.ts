import { IsNumber, IsEnum } from "class-validator";

// tslint:disable-next-line:max-classes-per-file
export class SubStatistics {
    @IsNumber()
    public ticket_year: number;
    @IsNumber()
    public ticket_month: number;
    @IsNumber()
    public ticket_service: string;
    @IsNumber()
    public ticket_office: string;
    @IsNumber()
    public ticket_operator: string;
    @IsNumber()
    public ticket_sub_total: number;
}

// tslint:disable-next-line:max-classes-per-file
export class StatisticsResponse {
    @IsNumber()
    public ticket_total: number;
    @IsEnum(SubStatistics)
    public sub_statistics: SubStatistics[];
}
