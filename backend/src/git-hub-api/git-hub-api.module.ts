import {Module} from "@nestjs/common";
import {GitHubApiService} from "./git-hub-api.service";
import {GitHubApiController} from "./git-hub-api.controller";
import {octokitProvider} from "./octokit.provider";

@Module({
    imports: [],
    providers: [GitHubApiService, octokitProvider],
    controllers: [GitHubApiController],
})
export class GitHubApiModule {}