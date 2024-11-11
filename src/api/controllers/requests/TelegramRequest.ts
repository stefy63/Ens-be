import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TelegramRequest {
    @IsString()
    public phone: string;

    @IsString()
    public message: string;
    
    @IsArray()
    @Type(() => AttachmentTelegramRequest)
    @ValidateNested({ each: true })
    public attachments: AttachmentTelegramRequest[];
}

// tslint:disable-next-line:max-classes-per-file
export class AttachmentTelegramRequest {
    @IsString()
    public path: string;

    @IsString()
    public name: string;
}
