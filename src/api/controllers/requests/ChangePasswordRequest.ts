import { IsString, IsOptional } from 'class-validator';

export class ChangePasswordRequest {

    @IsOptional()
    @IsString()
    public old_password?: string;

    @IsString()
    public new_password: string;
}
