import {Module} from '@nestjs/common';
import {ProjectMediaController} from "./project-media.controller";
import {ProjectMediaService} from "./project-media.service";

@Module({
    imports: [],
    controllers: [ProjectMediaController],
    providers: [ProjectMediaService],
})
export class ProjectMediaModule {}