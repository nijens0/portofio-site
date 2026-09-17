import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateDeveloperDto} from "./dto/create-developer.dto";
import {plainToInstance} from "class-transformer";
import {ReadDeveloperDto} from "./dto/read-developer.dto";
import {UpdateDeveloperDto} from "./dto/update-developer.dto";
import {ReadProjectDto} from "../project/dto/read-project-dto";

@Injectable()
export class developerService {

    constructor(private readonly prisma: PrismaService) {}

    async createDeveloper(dto: CreateDeveloperDto) {

        const developer = await this.prisma.developers.create({
            data: dto
        });

        return plainToInstance(ReadDeveloperDto, developer);
    }

    async readDeveloperById(id: number) {
        const existing = await this.prisma.developers.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Developer with id ${id} not found`);
        }

        return plainToInstance(ReadDeveloperDto, existing);
    }

    async readAllDevelopers() {
        const developers = await this.prisma.developers.findMany();

        return plainToInstance(ReadDeveloperDto, developers)
    }

    async updateDeveloperById(id: number, dto: UpdateDeveloperDto) {
        const existing = await this.prisma.developers.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Developer with id ${id} not found`);
        }

        const update = await this.prisma.developers.update({
            where: { id },
            data: dto
        });

        return plainToInstance(ReadDeveloperDto, update);
    }

    async deleteDeveloperById(id: number) {
        const existing = await this.prisma.developers.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Developer with id ${id} not found`);
        }

        const deleted = await this.prisma.developers.delete({where: { id } });

        return plainToInstance(ReadDeveloperDto, deleted);
    }

    async getDeveloperProjectsById(id: number) {
        const existing = await this.prisma.developers.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException(`Developer with id ${id} not found`);
        }

        const projects = await this.prisma.project.findMany({
            where: {
                dev_project_cross_ref: {
                    some: { dev_id: id }
                }
            }
        });

        return plainToInstance(ReadProjectDto, projects);
    }
}