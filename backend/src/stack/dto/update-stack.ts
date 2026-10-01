import {IsString, IsOptional} from "class-validator";

export class UpdateStackDto {
    @IsString()
    @IsOptional()
    technology: string;
}