import { IsOptional, IsString } from 'class-validator'

export class UpdateDeveloperDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    surname?: string;

    @IsString()
    @IsOptional()
    nickname?: string;
}