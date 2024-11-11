import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class ReverseSmsRequest {
    @IsString()
    @IsNotEmpty()
    public phone: string;

    @IsString()
    @IsNotEmpty()
    public message: string;

    @IsNumber()
    @IsNotEmpty()
    public id_category: number;
}
