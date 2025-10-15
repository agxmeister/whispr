import { Container } from "inversify";
import { LoggerService } from "@/modules/logger";
import { ConfigRepository } from "@/modules/config/repository";
import { ConfigService } from "@/modules/config/service";
import { ProfileService } from "@/modules/profile/service";
import { EdgeRepository, EdgeService } from "@/modules/edge";
import { AssistantService } from "@/modules/assistant";
import { assistantRegistry } from "@/modules/assistant/assistantRegistry";
import { EdgeToolMiddlewaresFactory, MiddlewareDiscovery } from "@/modules/mcp/middleware";
import { McpServerFactory, ProcessorFactory } from "@/modules/mcp";
import {
    EdgeToolService,
    RestFactory,
    ApiEndpointFactory,
    AcknowledgedApiEndpointFactory,
    GetApiEndpointsFactory,
    GetApiEndpointDetailsFactory,
    CallApiEndpointFactory
} from "@/modules/edge/tool";
import { AcknowledgmentTokenService } from "@/modules/edge/tool/token/service";
import { AcknowledgmentTokenRepository } from "@/modules/edge/tool/token/repository";
import { join, resolve } from "path";
import minimist from "minimist";
import { dependencies } from "@/dependencies";

const args = minimist(process.argv.slice(2));
const logPath = join(__dirname, '../logs/app.log');
const configPath = args.config ? resolve(args.config) : join(__dirname, '../config.json');

const container = new Container();

container.bind(Container).toConstantValue(container);

container.bind(dependencies.LoggerService).toDynamicValue(() => {
    return new LoggerService(logPath);
});

container.bind(dependencies.ConfigRepository).toDynamicValue(() => {
    return new ConfigRepository(configPath);
});

container.bind(dependencies.ConfigService).to(ConfigService);

container.bind(dependencies.ProfileService).to(ProfileService);

container.bind(dependencies.EdgeRepository).to(EdgeRepository);

container.bind(dependencies.EdgeService).to(EdgeService);

container.bind(dependencies.AssistantRegistry).toConstantValue(assistantRegistry);

container.bind(dependencies.AssistantService).to(AssistantService);

container.bind(dependencies.EdgeToolMiddlewaresFactory).to(EdgeToolMiddlewaresFactory);

container.bind(dependencies.EdgeToolFactories).toDynamicValue(() => {
    const profileService = container.get<ProfileService>(dependencies.ProfileService);
    const restApiFactory = new RestFactory();
    const tokenRepository = new AcknowledgmentTokenRepository(join(__dirname, '../data/acknowledgment-tokens.json'));
    const tokenService = new AcknowledgmentTokenService(tokenRepository);
    return [
        new ApiEndpointFactory(restApiFactory, profileService),
        new AcknowledgedApiEndpointFactory(restApiFactory, profileService, tokenService),
        new GetApiEndpointsFactory(restApiFactory, profileService),
        new GetApiEndpointDetailsFactory(restApiFactory, profileService),
        new CallApiEndpointFactory(restApiFactory, profileService),
    ];
});

container.bind(dependencies.EdgeToolService).to(EdgeToolService);

container.bind(dependencies.ProcessorFactory).to(ProcessorFactory);

container.bind(dependencies.McpServerFactory).to(McpServerFactory);

container.bind(dependencies.MiddlewareDiscovery).to(MiddlewareDiscovery);

export {container}
