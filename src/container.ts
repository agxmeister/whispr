import { Container } from "inversify";
import { LoggerFactory } from "@/modules/logger";
import { ConfigRepository } from "@/modules/config/ConfigRepository";
import { ConfigService } from "@/modules/config/ConfigService";
import { ProfileFactory } from "@/modules/profile";
import { EdgeRepository, EdgeService } from "@/modules/edge";
import { AssistantService } from "@/modules/assistant";
import { assistantRegistry } from "@/modules/assistant/assistantRegistry";
import { MiddlewaresFactory, MiddlewareDiscovery } from "@/modules/tool/middleware";
import { ProcessorFactory } from "@/modules/tool/processor";
import { McpServerFactory } from "@/modules/mcp";
import {
    EdgeToolService,
    RestFactory,
    ApiEndpointFactory,
    AcknowledgedApiEndpointFactory,
    GetApiEndpointsFactory,
    GetApiEndpointDetailsFactory,
    CallApiEndpointFactory,
    EdgeToolFactory
} from "@/modules/edge/tool";
import { AcknowledgmentTokenService } from "@/modules/edge/tool/token/TokenService";
import { AcknowledgmentTokenRepository } from "@/modules/edge/tool/token/TokenRepository";
import { join, resolve } from "path";
import minimist from "minimist";
import { dependencies } from "@/dependencies";

const args = minimist(process.argv.slice(2));
const logPath = join(__dirname, '../logs/app.log');
const configPath = args.config ? resolve(args.config) : join(__dirname, '../config.json');
const acknowledgmentTokensPath = join(__dirname, '../data/acknowledgment-tokens.json');

const container = new Container();

container.bind(Container).toConstantValue(container);

container.bind(dependencies.LoggerFactory).toDynamicValue(() => {
    return new LoggerFactory(logPath);
});

container.bind(dependencies.ConfigRepository).toDynamicValue(() => {
    return new ConfigRepository(configPath);
});

container.bind(dependencies.AcknowledgmentTokenRepository).toDynamicValue(() => {
    return new AcknowledgmentTokenRepository(acknowledgmentTokensPath);
});

container.bind(dependencies.AssistantRegistry).toConstantValue(assistantRegistry);

container.bind(dependencies.ConfigService).to(ConfigService);

container.bind(dependencies.ProfileFactory).to(ProfileFactory);

container.bind(dependencies.EdgeRepository).to(EdgeRepository);

container.bind(dependencies.EdgeService).to(EdgeService);

container.bind(dependencies.AssistantService).to(AssistantService);

container.bind(dependencies.EdgeToolMiddlewaresFactory).to(MiddlewaresFactory);

container.bind(dependencies.RestFactory).to(RestFactory);

container.bind(dependencies.AcknowledgmentTokenService).to(AcknowledgmentTokenService);

container.bind<EdgeToolFactory>(dependencies.EdgeToolFactories).to(ApiEndpointFactory);
container.bind<EdgeToolFactory>(dependencies.EdgeToolFactories).to(AcknowledgedApiEndpointFactory);
container.bind<EdgeToolFactory>(dependencies.EdgeToolFactories).to(GetApiEndpointsFactory);
container.bind<EdgeToolFactory>(dependencies.EdgeToolFactories).to(GetApiEndpointDetailsFactory);
container.bind<EdgeToolFactory>(dependencies.EdgeToolFactories).to(CallApiEndpointFactory);

container.bind(dependencies.EdgeToolService).to(EdgeToolService);

container.bind(dependencies.ProcessorFactory).to(ProcessorFactory);

container.bind(dependencies.McpServerFactory).to(McpServerFactory);

container.bind(dependencies.MiddlewareDiscovery).to(MiddlewareDiscovery);

export {container}
