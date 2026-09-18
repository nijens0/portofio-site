import {Controller, Post, Patch, Get, Delete, Param} from '@nestjs/common';
import {ProjectMediaService} from "./project-media.service";
import {CreateProjectMediaDto} from "./dto/create-project-media.dto";
import {UpdateProjectMediaDto} from "./dto/update-project-media.dto";

@Controller('project-media')
export class ProjectMediaController {

    constructor(private readonly service: ProjectMediaService) {}

    @Post()
    createProjectMedia(dto: CreateProjectMediaDto) {
        return this.service.createProjectMedia(dto);
    }

    @Get(':id')
    readProjectMediaById(@Param('id') id: string) {
        return this.service.readProjectMediaById(+id)
    }

    @Get()
    readAllProjectMediaById(@Param('id') id: string) {
        return this.service.readAllProjectMediaByProjectId(+id)
    }

    @Patch(':id')
    updateProjectMediaById(@Param('id') id: string, dto: UpdateProjectMediaDto) {
        return this.service.updateProjectMediaById(+id, dto)
    }

    @Delete(':id')
    deleteProjectMediaById(@Param('id') id: string) {
        return this.service.deleteProjectMediaById(+id)
    }

}