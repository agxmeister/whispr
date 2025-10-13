import { Container } from "inversify";
import { LoggerService } from "@/modules/logger";
import { ConfigRepository } from "@/modules/config/repository";
import { ConfigService } from "@/modules/config/service";
import { ProfileService } from "@/modules/profile/service";
import { EdgeRepository, EdgeService } from "@/modules/edge";
import { join, resolve } from "path";
import minimist from "minimist";
import { dependencies } from "@/dependencies";

const args = minimist(process.argv.slice(2));
const configPath = args.config ? resolve(args.config) : join(__dirname, '../config.json');

const container = new Container();

container.bind(dependencies.LoggerService).toDynamicValue(() => {
    return new LoggerService(join(__dirname, '../logs/app.log'));
});

container.bind(dependencies.ConfigRepository).toDynamicValue(() => {
    return new ConfigRepository(configPath);
});

container.bind(dependencies.ConfigService).to(ConfigService);

container.bind(dependencies.ProfileService).to(ProfileService);

container.bind(dependencies.EdgeRepository).to(EdgeRepository);

container.bind(dependencies.EdgeService).to(EdgeService);

export {container}
