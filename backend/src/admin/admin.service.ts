import {Injectable, ConflictException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import * as argon2 from 'argon2';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {ChangePasswordAdminDto} from "./dto/change-password-admin.dto";
import {ReadAdminDto} from './dto/read-admin.dto';
import {PrismaService} from "../prisma/prisma.service";
import {plainToInstance} from 'class-transformer';

@Injectable()
export class AdminService {

    constructor(private prisma: PrismaService) {}

    async createAdmin(dto: CreateAdminDto) {
        const existing = await this.prisma.admin.findUnique({ where: { email: dto.email } });

        if (existing) {
            throw new ConflictException('Admin with this email already exists');
        }

        const passwordHash = await argon2.hash(dto.password);

        const admin = await this.prisma.admin.create({
            data: {
                email: dto.email,
                password_hash: passwordHash
            }
        });

        return plainToInstance(ReadAdminDto, admin, {excludeExtraneousValues: true});
    }

    async updateAdminById(id: number, dto: UpdateAdminDto) {
        const existing = await this.prisma.admin.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }

        const update = await this.prisma.admin.update({
            where: { id },
            data: dto
        });

        return plainToInstance(ReadAdminDto, update, {excludeExtraneousValues: true});
    }

    async changePasswordAdminByEmail(email: string, dto: ChangePasswordAdminDto) {
        const existing = await this.prisma.admin.findUnique({ where: { email } });

        if (!existing) {
            throw new NotFoundException(`Admin with this email ${email} not found`);
        }

        const verify = await argon2.verify(existing.password_hash, dto.currentPassword)

        if (!verify) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const newHash = await argon2.hash(dto.newPassword);

        const update = await this.prisma.admin.update({
            where : { email },
            data: {
                password_hash: newHash,
            }
        })

        return plainToInstance(ReadAdminDto, update, {excludeExtraneousValues: true});
    }

    async readAdminById(id: number) {
        const existing = await this.prisma.admin.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }

        return plainToInstance(ReadAdminDto, existing, {excludeExtraneousValues: true});
    }

    async deleteAdminById(id: number) {
        const existing = await this.prisma.admin.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }

        const deleted = await this.prisma.admin.delete({ where: { id } });

        return plainToInstance(ReadAdminDto, deleted, { excludeExtraneousValues: true });
    }
}