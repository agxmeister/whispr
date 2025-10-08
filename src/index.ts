import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {EdgeService, EdgeRepository} from "@/modules/edge";
import {ConfigService} from "@/modules/config";
import {ProfileService} from "@/modules/profile";
import {McpService, ProcessorFactory, EdgeToolMiddlewaresFactory} from "@/modules/mcp";
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
import {MiddlewareDiscovery} from "@/modules/mcp/middleware";
import {container, dependencies} from "@/container";

dotenv.config();

(async () => {
    const middlewareDiscovery = new MiddlewareDiscovery();
    await middlewareDiscovery.discover(path.join(__dirname, 'middlewares'));

    const configService = container.get<ConfigService>(dependencies.ConfigService);
    const profileService = container.get<ProfileService>(dependencies.ProfileService);
    const edgeRepository = new EdgeRepository(configService);
    const edgeService = new EdgeService(edgeRepository);
    const edges = await edgeService.getEdges();
    const assistantService = new AssistantService(assistantRegistry, configService);
    const assistantFactories = await assistantService.getAssistantFactories();
    const processorFactory = new ProcessorFactory(profileService);
    const serverService = new McpService(processorFactory);
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
    const edgeToolMiddlewaresFactory = new EdgeToolMiddlewaresFactory(configService);
    const server = await serverService.getMcpServer(
        edges,
        edgeToolFactories,
        edgeToolMiddlewaresFactory,
        assistantFactories,
    );
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
