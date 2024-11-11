import { IsNumber } from "class-validator";

export class QueueOpResponse {
    @IsNumber()
    public operatorActive: number;

}
