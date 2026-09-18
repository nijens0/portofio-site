import {IsString, IsNumber, IsOptional} from 'class-validator';

export class CreateProjectMediaDto {
    @IsString()
    type: string;

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