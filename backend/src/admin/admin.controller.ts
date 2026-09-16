import {AdminService} from "./admin.service";
import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import {CreateAdminDto} from "./dto/create-admin.dto";
import {UpdateAdminDto} from "./dto/update-admin.dto";
import {ChangeAdminPasswordDto} from "./dto/change-admin-password.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly service: AdminService) {}

    @Post()
    createAdmin(@Body() dto: CreateAdminDto) {
        return this.service.createAdmin(dto);
    }

    @Get(':id')
    readAdminById(@Param('id') id: string) {
        return this.service.readAdminById(+id);
    }

    @Patch(':id')
    updateAdminById(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
        return this.service.updateAdminById(+id, dto);
    }

    @Patch(':email/password')
    changePasswordAdminByEmail(@Param('email') email: string, @Body() dto: ChangeAdminPasswordDto) {
        return this.service.changeAdminPasswordByEmail(email, dto);
    }

    @Delete(':id')
    deleteAdminById(@Param('id') id: string) {
        return this.service.deleteAdminById(+id);
    }
}