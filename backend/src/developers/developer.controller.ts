import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import {DeveloperService} from "./developer.service";
import {CreateDeveloperDto} from "./dto/create-developer.dto";
import {UpdateDeveloperDto} from "./dto/update-developer.dto";


@Controller('developers')
export class DeveloperController {

    constructor(private readonly developerService: DeveloperService) {}

    @Post()
    createDeveloper(@Body() dto: CreateDeveloperDto) {
        return this.developerService.createDeveloper(dto);
    }

    @Get(':id')
    readDeveloperById(@Param('id') id: string) {
        return this.developerService.readDeveloperById(+id)
    }

    @Get()
    readAllDevelopers() {
        return this.developerService.readAllDevelopers();
    }

    @Patch(':id')
    updateDeveloperById(@Param('id') id: string, dto: UpdateDeveloperDto) {
        return this.developerService.updateDeveloperById(+id, dto);
    }

    @Delete(':id')
    deleteDeveloperById(@Param('id') id: string) {
        return this.developerService.deleteDeveloperById(+id);
    }

    @Get(':id/projects')
    getDeveloperProjectsById(@Param('id') id: string) {
        return this.developerService.getDeveloperProjectsById(+id);
    }
}