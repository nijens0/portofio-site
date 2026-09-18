import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateProjectMediaDto} from "./dto/create-project-media.dto";
import {ReadProjectMediaDto} from "./dto/read-project-media.dto";
import {UpdateProjectMediaDto} from "./dto/update-project-media.dto";
import {plainToInstance} from "class-transformer";

@Injectable()
export class ProjectMediaService {

    constructor(private readonly prisma: PrismaService) {}

    async createProjectMedia(dto: CreateProjectMediaDto) {
        const project = await this.prisma.project.findUnique({where: {id: dto.project_id} });

        if (!project) {
            throw new NotFoundException(`Project with id ${dto.project_id} not found`);
        }

        const projectMedia = await this.prisma.project_media.create({
            data: dto
        });

        return plainToInstance(ReadProjectMediaDto, projectMedia);
    }

    async readProjectMediaById(id: number) {
        const projectMedia = await this.prisma.project_media.findUnique({where: { id } });

        if (!projectMedia) {
            throw new NotFoundException(`Project media with id ${id} not found`);
        }

        return plainToInstance(ReadProjectMediaDto, projectMedia);
    }

    async readAllProjectMediaByProjectId(id: number) {
        const project = await this.prisma.project.findUnique({where: { id } });

        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        const projectMedia = await this.prisma.project_media.findMany({
            where: {
                project_id: id
            }
        });

        return plainToInstance(ReadProjectMediaDto, projectMedia);
    }

    async updateProjectMediaById(id: number, dto: UpdateProjectMediaDto) {
        const projectMedia = this.prisma.project_media.findUnique({where: { id } });

        if (!projectMedia) {
            throw new NotFoundException(`Project media with id ${id} not found`);
        }

        const update = await this.prisma.project_media.update({
            where: { id },
            data: dto
        });

        return plainToInstance(ReadProjectMediaDto, update);
    }

    async deleteProjectMediaById(id: number) {
        const projectMedia = await this.prisma.project_media.findUnique({where: { id } });

        if (!projectMedia) {
            throw new NotFoundException(`Project media with id ${id} not found`);
        }

        const deleted = await this.prisma.project_media.delete({
            where: { id }
        });

        return plainToInstance(ReadProjectMediaDto, deleted);
    }

    async deleteAllProjectMediaByProjectId(id: number) {
        const project = await this.prisma.project.findUnique({where: { id } });

        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        const batchPayload = await this.prisma.project_media.deleteMany({
            where: {
                project_id: id
            }
        });


        return batchPayload.count;
    }
}