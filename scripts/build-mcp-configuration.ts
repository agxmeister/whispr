import * as path from 'path';
import minimist from 'minimist';
import {getServices} from "../src/utils";

const args = minimist(process.argv.slice(2));
const rootDir = path.resolve(__dirname, '..');

const indexPath = path.join(rootDir, 'dist/index.js');

const servicesPath = args.services
    ? path.resolve(args.services)
    : undefined;

(async () => {
    const services = await getServices(servicesPath);

    const args = [indexPath];
    if (servicesPath) {
        args.push("--services", servicesPath);
    }

    const env: Record<string, string> = {};
    for (const service of services) {
        for (const variable of service.configuration) {
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
