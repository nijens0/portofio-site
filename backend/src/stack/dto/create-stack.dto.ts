import {IsString} from 'class-validator';

export class CreateStackDto {
    @IsString()
    technology: string;
}