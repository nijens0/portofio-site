import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CreateProjectDto} from "./dto/create-project.dto";
import {plainToInstance} from "class-transformer";
import {ReadProjectDto} from "./dto/read-project.dto";
import {UpdateProjectDto} from "./dto/update-project.dto";


@Injectable()
export class ProjectService {

    constructor(private readonly prisma: PrismaService) {}

    async createProject(dto: CreateProjectDto) {

        const project = await this.prisma.project.create({
            data: dto
        });

        return plainToInstance(ReadProjectDto, project);
    }

    async readProjectById(id: number) {

        const project = await this.prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        return plainToInstance(ReadProjectDto, project);
    }

    async updateProjectById(id: number, dto: UpdateProjectDto) {
        const project = await this.prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        const update = this.prisma.project.update({
            where: { id },
            data: dto
        });

        return plainToInstance(ReadProjectDto, update);
    }

    async deleteProjectById(id: number) {
        const project = await this.prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        const deleted = await this.prisma.project.delete({ where: { id} });

        return plainToInstance(ReadProjectDto, deleted);
    }
}