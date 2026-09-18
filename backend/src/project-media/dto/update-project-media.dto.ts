import {IsString, IsNumber, IsOptional} from 'class-validator';

export class UpdateProjectMediaDto {
    @IsString()
    @IsOptional()
    type?: string;

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