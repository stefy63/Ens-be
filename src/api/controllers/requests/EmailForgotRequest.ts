import { IsString, IsUrl, IsOptional, IsEmail } from "class-validator";

export class EmailForgotRequest {
    @IsEmail()
    public email: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    public return_link: string;

}
