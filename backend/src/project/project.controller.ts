import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import {CreateProjectDto} from "./dto/create-project.dto";
import {ProjectService} from "./project.service"
import {UpdateProjectDto} from "./dto/update-project.dto";


@Controller('projects')
export class ProjectController {

    constructor(private readonly service: ProjectService) {}

    @Post()
    createProject(@Body() dto: CreateProjectDto) {
        return this.service.createProject(dto);
    }

    @Get(':id')
    readProject(@Param('id') id: string) {
        return this.service.readProjectById(+id)
    }

    @Patch(':id')
    updateProjectById(@Param('id') id: string, dto: UpdateProjectDto) {
        return this.service.updateProjectById(+id, dto)
    }

    @Delete(':id')
    deleteProjectById(@Param('id') id: string) {
        return this.service.deleteProjectById(+id)
    }

}