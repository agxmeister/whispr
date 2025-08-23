import * as path from 'path';
import minimist from 'minimist';
import {EdgeService, EdgeRepository} from "@/modules/edge";
import {ConfigService, ConfigRepository} from "@/modules/config";

const args = minimist(process.argv.slice(2));
const rootDir = path.resolve(__dirname, '..');

const indexPath = path.join(rootDir, 'dist/index.js');

const configPath = args.config
    ? path.resolve(args.config)
    : path.join(__dirname, '../config.json');

(async () => {
    const configRepository = new ConfigRepository(configPath);
    const configService = new ConfigService(configRepository);
    const edgeRepository = new EdgeRepository(configService);
    const edgeService = new EdgeService(edgeRepository);
    const edges = await edgeService.getEdges();

    const args = [indexPath];
    if (configPath) {
        args.push("--config", configPath);
    }

    const env: Record<string, string> = {};
    for (const edge of edges) {
        if (!edge.environment) {
            continue;
        }
        for (const variable of edge.environment) {
            env[variable.name] = `---> ${variable.description} <---`;
        }
    }

    const configuration = {
        type: "stdio",
        command: "node",
        args: args,
        env: env,
    };

    console.log(JSON.stringify(configuration, null, 4));
})();
