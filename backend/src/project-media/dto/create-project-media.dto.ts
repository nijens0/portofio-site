import {IsString, IsNumber, IsOptional, IsEnum} from 'class-validator';
import {media_type} from "../../generated/prisma/enums";

export class CreateProjectMediaDto {
    @IsEnum(media_type)
    type: media_type;

    @IsString()
    url: string;

    @IsNumber()
    @IsOptional()
    sort_order?: number;

    @IsString()
    @IsOptional()
    caption?: string;

    @IsNumber()
    project_id: number;
}