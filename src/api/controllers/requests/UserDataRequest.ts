import { IsString, IsOptional } from 'class-validator';

export class UserDataRequest {

    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public surname?: string;
}
