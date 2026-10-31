import {Controller, Get} from "@nestjs/common";
import {GitHubApiService} from "./git-hub-api.service";

@Controller('git-hub-api')
export class GitHubApiController {

    constructor(private readonly gitHubApiService: GitHubApiService) {
    }

    @Get('contribution-calendar')
    getContributionCalendar() {
        return this.gitHubApiService.getContributionCalendar();
    }
}