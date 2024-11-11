import { IsNumberString, IsOptional, IsString, IsBoolean } from 'class-validator';

export class PaginationRequest {
    @IsOptional()
    @IsNumberString()
    public size: number;
    @IsOptional()
    @IsNumberString()
    public pageNumber: number;
    @IsOptional()
    @IsString()
    public filter: string;
    @IsOptional()
    @IsBoolean()
    public onlyOperator: boolean;
}
