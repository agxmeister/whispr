import * as path from 'path';
import minimist from 'minimist';
import {EdgeService, EdgeRepository} from "../src/modules/edge";

const args = minimist(process.argv.slice(2));
const rootDir = path.resolve(__dirname, '..');

const indexPath = path.join(rootDir, 'dist/index.js');

const edgesPath = args.edges
    ? path.resolve(args.edges)
    : undefined;

(async () => {
    const edgeRepository = new EdgeRepository(edgesPath);
    const edgeService = new EdgeService(edgeRepository);
    const edges = await edgeService.getEdges();

    const args = [indexPath];
    if (edgesPath) {
        args.push("--edges", edgesPath);
    }

    const env: Record<string, string> = {};
    for (const edge of edges) {
        for (const variable of edge.configuration) {
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
