import {IsString, IsNumber, IsOptional, IsEnum} from 'class-validator';
import {media_type} from "../../generated/prisma/enums";

export class UpdateProjectMediaDto {
    @IsEnum(media_type)
    @IsOptional()
    type?: media_type;

    @IsString()
    @IsOptional()
    url?: string;

    @IsNumber()
    @IsOptional()
    sort_order?: number;

    @IsString()
    @IsOptional()
    caption?: string;

    @IsNumber()
    @IsOptional()
    project_id: number;
}