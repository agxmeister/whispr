import { Container } from "inversify";
import { LoggerService } from "@/modules/logger";
import { ConfigRepository } from "@/modules/config/repository";
import { ConfigService } from "@/modules/config/service";
import { ProfileService } from "@/modules/profile/service";
import { EdgeRepository, EdgeService } from "@/modules/edge";
import { join, resolve } from "path";
import minimist from "minimist";

export const dependencies = {
    LoggerService: Symbol.for("LoggerService"),
    ConfigRepository: Symbol.for("ConfigRepository"),
    ConfigService: Symbol.for("ConfigService"),
    ProfileService: Symbol.for("ProfileService"),
    EdgeRepository: Symbol.for("EdgeRepository"),
    EdgeService: Symbol.for("EdgeService"),
} as const;

const args = minimist(process.argv.slice(2));
const configPath = args.config ? resolve(args.config) : join(__dirname, '../config.json');

const container = new Container();

container.bind(dependencies.LoggerService).toDynamicValue(() => {
    return new LoggerService(join(__dirname, '../logs/app.log'));
});

container.bind(dependencies.ConfigRepository).toDynamicValue(() => {
    return new ConfigRepository(configPath);
});

container.bind(dependencies.ConfigService).toDynamicValue(() => {
    const configRepository = container.get<ConfigRepository>(dependencies.ConfigRepository);
    return new ConfigService(configRepository);
});

container.bind(dependencies.ProfileService).toDynamicValue(() => {
    const configService = container.get<ConfigService>(dependencies.ConfigService);
    return new ProfileService(configService);
});

container.bind(dependencies.EdgeRepository).toDynamicValue(() => {
    const configService = container.get<ConfigService>(dependencies.ConfigService);
    return new EdgeRepository(configService);
});

container.bind(dependencies.EdgeService).toDynamicValue(() => {
    const edgeRepository = container.get<EdgeRepository>(dependencies.EdgeRepository);
    return new EdgeService(edgeRepository);
});

export {container}
