import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import ts from "typescript";
import ProjectService = ts.server.ProjectService;

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [ProjectService]
})
export class ProjectModule {}