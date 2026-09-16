import { Exclude, Expose } from 'class-transformer';

export class ReadAdminDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Exclude()
    password_hash: string;
}