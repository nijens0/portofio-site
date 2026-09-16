import {IsOptional, IsString} from 'class-validator';

export class CreateDeveloperDto {
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