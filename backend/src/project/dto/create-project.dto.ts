import { IsString, IsBoolean, IsOptional, IsDateString } from "class-validator";

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    preview_url: string;

    @IsString()
    @IsOptional()
    employer?: string;

    @IsString()
    description: string;

    @IsDateString({ strict: true})
    work_started: Date;

    @IsDateString({ strict: true })
    @IsOptional()
    work_ended?: Date;

    @IsBoolean()
    @IsOptional()
    is_featured?: boolean;

    @IsString()
    @IsOptional()
    git: string;
}