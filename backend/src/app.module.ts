import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {AdminModule} from "./admin/admin.module";
import {DeveloperModule} from "./developers/developer.module";


@Module({
  imports: [PrismaModule, AdminModule, DeveloperModule],
})
export class AppModule {}
