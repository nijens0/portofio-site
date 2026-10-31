import {providersTokens} from '../constants';
import {ConfigService} from "@nestjs/config";
import {graphql} from "@octokit/graphql";

export const octokitProvider = {
    provide: providersTokens.OCTOKIT,
    useFactory: (configService: ConfigService) => {
        const personalAccessToken = configService.get("PERSONAL_ACCESS_TOKEN");

        return graphql.defaults({
            headers: {
                authorization: `token ${personalAccessToken}`,
            }
        });
    },
    inject: [ConfigService]
}