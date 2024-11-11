import { IsString, ValidateNested, IsOptional } from "class-validator";
import { Type } from 'class-transformer';

// tslint:disable-next-line:max-classes-per-file
export class AttachmentEmailRequest {
    @IsString()
    public path: string;

    @IsString()
    public name: string;
}

// tslint:disable-next-line:max-classes-per-file
export class EmailManagerRequest {
    @IsString()
    public sender: string;

    @IsString()
    public message: string;

    @IsOptional()
    @IsString()
    public subject: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AttachmentEmailRequest)
    public attachments: AttachmentEmailRequest[];
}
