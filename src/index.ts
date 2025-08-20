import dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {EdgeService, EdgeRepository} from "./modules/edge";
import {ConfigService, ConfigRepository, ProfileService} from "./modules/config";
import {McpService} from "./modules/mcp";
import {CallApiEndpointFactory, GetApiEndpointDetailsFactory, GetApiEndpointsFactory} from "./modules/tool";
import {RatatouilleFactory} from "./modules/assistant/ratatouille";

dotenv.config();
const args = minimist(process.argv.slice(2));

(async () => {
    const configRepository = new ConfigRepository(args.config
        ? path.resolve(args.config)
        : path.join(__dirname, '../config.json')
    );
    const configService = new ConfigService(configRepository);
    const config = await configService.getConfig();
    const profileService = new ProfileService(config);
    const profile = profileService.getProfile();
    const edgeRepository = new EdgeRepository(configService);
    const edgeService = new EdgeService(edgeRepository);
    const edges = await edgeService.getEdges();
    const serverService = new McpService();
    const server = serverService.getMcpServer(
        edges,
        profile,
        [
            new GetApiEndpointsFactory(),
            new GetApiEndpointDetailsFactory(),
            new CallApiEndpointFactory(),
        ],
        [
            new RatatouilleFactory({
                apiUrl: process.env.ASSISTANT_RATATOUILLE_API_URL || "",
                chiefName: process.env.ASSISTANT_RATATOUILLE_CHIEF_NAME || "",
            }),
        ]
    );
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
