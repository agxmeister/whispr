import dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {EdgeService, EdgeRepository} from "@/modules/edge";
import {ConfigService, ConfigRepository} from "@/modules/config";
import {ProfileService} from "@/modules/profile";
import {McpService} from "@/modules/mcp";
import {
    ApiEndpointFactory,
    AcknowledgedApiEndpointFactory,
    CallApiEndpointFactory,
    GetApiEndpointDetailsFactory,
    GetApiEndpointsFactory,
    EdgeToolService,
    RestFactory
} from "@/modules/edge/tool";
import {AcknowledgmentTokenService} from "@/modules/edge/tool/token/service";
import {AcknowledgmentTokenRepository} from "@/modules/edge/tool/token/repository";
import {assistantRegistry} from "@/modules/assistant/assistantRegistry";
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
    const assistantService = new AssistantService(assistantRegistry, configService);
    const assistantFactories = await assistantService.getAssistantFactories();
    const serverService = new McpService();
    const restApiFactory = new RestFactory();
    const tokenRepository = new AcknowledgmentTokenRepository(path.join(__dirname, '../data/acknowledgment-tokens.json'));
    const tokenService = new AcknowledgmentTokenService(tokenRepository);
    const edgeToolService = new EdgeToolService(profileService, [
        new ApiEndpointFactory(restApiFactory, profileService),
        new AcknowledgedApiEndpointFactory(restApiFactory, profileService, tokenService),
        new GetApiEndpointsFactory(restApiFactory, profileService),
        new GetApiEndpointDetailsFactory(restApiFactory, profileService),
        new CallApiEndpointFactory(restApiFactory, profileService),
    ]);
    const edgeToolFactories = await edgeToolService.getEdgeToolFactories();
    const server = await serverService.getMcpServer(edges, edgeToolFactories, assistantFactories);
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
