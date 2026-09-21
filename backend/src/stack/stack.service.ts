import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateStackDto} from "./dto/create-stack.dto";
import {plainToInstance} from "class-transformer";
import {ReadStackDto} from "./dto/read-stack.dto";
import {UpdateStackDto} from "./dto/update-stack";

@Injectable()
export class StackService {

    constructor(private readonly prisma: PrismaService) {
    }

    async createStack(dto: CreateStackDto) {
        const existing = await this.prisma.stack.findUnique({where: {technology: dto.technology}});

        if (existing) {
            throw new ConflictException(`Stack ${existing.technology} already exists`);
        }

        const stack = await this.prisma.stack.create({
            data: dto
        });

        return plainToInstance(ReadStackDto, stack);
    }

    async readStackById(id: number) {
        const existing = await this.prisma.stack.findUnique({where: {id}});

        if (!existing) {
            throw new NotFoundException(`Stack with id ${id} not found`);
        }

        return plainToInstance(ReadStackDto, existing);
    }

    async readAllStacks() {
        const existing = await this.prisma.stack.findMany();

        if (existing.length  === 0) {
            throw new NotFoundException("There is no stacks");
        }

        return plainToInstance(ReadStackDto, existing);
    }

    async updateStackById(id: number, dto: UpdateStackDto) {
        const existing = await this.prisma.stack.findUnique({where: {id}});

        if (!existing) {
            throw new NotFoundException(`Stack with id ${id} not found`);
        }

        const update = await this.prisma.stack.update({
            where: {id},
            data: dto
        })

        return plainToInstance(ReadStackDto, update);
    }

    async deleteStackById(id: number) {
        const existing = await this.prisma.stack.findUnique({where: {id}});

        if (!existing) {
            throw new NotFoundException(`Stack with id ${id} not found`);
        }

        const deleted = await this.prisma.stack.delete({where: {id}});

        return plainToInstance(ReadStackDto, deleted);
    }
}