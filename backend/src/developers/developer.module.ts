import {Module} from "@nestjs/common";
import {DeveloperController} from "./developer.controller";
import {DeveloperService} from "./developer.service";

@Module({
    imports: [],
    controllers: [DeveloperController],
    providers: [DeveloperService],
})
export class DeveloperModule {}