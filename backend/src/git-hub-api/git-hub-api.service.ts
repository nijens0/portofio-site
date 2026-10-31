import {Inject, Injectable} from "@nestjs/common";
import {providersTokens} from "../constants";
import {graphql} from "@octokit/graphql"

@Injectable()
export class GitHubApiService {

    constructor(@Inject(providersTokens.OCTOKIT) private readonly octokit: typeof graphql) {
    }

    getContributionCalendar() {
        return this.octokit(`
            {
                user(login: "nijens0") {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                    contributionLevel
                                }
                            }
                        }
                    }
                }
            }
            `)
    }
}