import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import {ProjectService} from "./project.service";
import {ProjectMediaModule} from "../project-media/project-media.module";

@Module({
    imports: [ProjectMediaModule],
    controllers: [ProjectController],
    providers: [ProjectService]
})
export class ProjectModule {}