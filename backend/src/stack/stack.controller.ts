import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import {StackService} from "./stack.service";
import {CreateStackDto} from "./dto/create-stack.dto";
import {UpdateStackDto} from "./dto/update-stack";


@Controller('stack')
export class StackController {

    constructor(private readonly service: StackService) {}

    @Post()
    createStack(@Body() dto: CreateStackDto) {
        return this.service.createStack(dto);
    }

    @Get(':id')
    readStack(@Param("id") id: string) {
        return this.service.readStackById(+id)
    }

    @Get()
    readAllStacks() {
        return this.service.readAllStacks();
    }

    @Patch(':id')
    updateStackById(id: string, dto: UpdateStackDto) {
        return this.service.updateStackById(+id, dto)
    }

    @Delete(':id')
    deleteStackById(@Param("id") id: string) {
        return this.service.deleteStackById(+id);
    }
}