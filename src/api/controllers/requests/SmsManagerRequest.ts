import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class SmsManagerRequest {
    @IsOptional()
    public date?: string;

    @IsOptional()
    @IsString()
    public id?: string;

    @IsString()
    @IsNotEmpty()
    public orig: string;
    
    @IsOptional()
    @IsString()
    public dest?: string;
    
    @IsString()
    public body: string;
}
