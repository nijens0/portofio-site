import {Module} from "@nestjs/common";
import {GitHubApiService} from "./git-hub-api.service";
import {GitHubApiController} from "./git-hub-api.controller";

@Module({
    imports: [],
    providers: [GitHubApiService],
    controllers: [GitHubApiController],
})
export class GitHubApiModule {}