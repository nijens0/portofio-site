import {IsString, IsBoolean, IsOptional, IsDateString} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    preview_url?: string;

    @IsString()
    @IsOptional()
    employer?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString({ strict: true })
    @IsOptional()
    work_started?: Date;

    @IsDateString({ strict: true })
    @IsOptional()
    work_ended?: Date;

    @IsBoolean()
    @IsOptional()
    is_featured?: boolean;

    @IsString()
    @IsOptional()
    git?: string;
}