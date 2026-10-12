import { Expose } from 'class-transformer';

export class ReadAdminDto {
    @Expose()
    id: number;
    @Expose()
    email: string;

}