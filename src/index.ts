import dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {EdgeService, EdgeRepository} from "@/modules/edge";
import {ConfigService, ConfigRepository} from "@/modules/config";
import {ProfileService} from "@/modules/profile";
import {McpService} from "@/modules/mcp";
import {CallApiEndpointFactory, GetApiEndpointDetailsFactory, GetApiEndpointsFactory} from "@/modules/edge/tool";
import {RatatouilleFactory} from "@/modules/assistant/ratatouille";
import {AssistantService} from "@/modules/assistant";

dotenv.config();
const args = minimist(process.argv.slice(2));

(async () => {
    const configRepository = new ConfigRepository(args.config
        ? path.resolve(args.config)
        : path.join(__dirname, '../config.json')
    );
    const configService = new ConfigService(configRepository);
    const profileService = new ProfileService(configService);
    const edgeRepository = new EdgeRepository(configService);
    const edgeService = new EdgeService(edgeRepository);
    const edges = await edgeService.getEdges();
    const assistantService = new AssistantService([
        new RatatouilleFactory({
            apiUrl: process.env.ASSISTANT_RATATOUILLE_API_URL || "",
            chiefName: process.env.ASSISTANT_RATATOUILLE_CHIEF_NAME || "",
        }),
    ], configService);
    const assistants = await assistantService.getAssistants();
    const serverService = new McpService();
    const server = await serverService.getMcpServer(
        edges,
        [
            new GetApiEndpointsFactory(profileService),
            new GetApiEndpointDetailsFactory(profileService),
            new CallApiEndpointFactory(profileService),
        ],
        assistants
    );
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
