import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import {EdgeService, EdgeRepository} from "../src/modules/edge";
import {getNames, getDescriptions} from "../src/modules/tool";

type DxtManifest = {
    server: {
        mcp_config: {
            env: Record<string, any>;
        }
    };
    user_config: Record<string, any>;
    tools: Record<string, string>[];
}

const args = minimist(process.argv.slice(2));
const rootDir = path.resolve(__dirname, '..');
const templatePath = args.template
    ? path.resolve(args.template)
    : path.join(rootDir, 'dxt-manifest-template.json');
const outputPath = args.output
    ? path.resolve(args.output)
    : path.join(rootDir, 'manifest.json');
const edgesPath = args.edges
    ? path.resolve(args.edges)
    : undefined;
const filter = args.filter
    ? args.filter.split(',').map((edge: string) => edge.trim().toLowerCase())
    : [];

(async () => {
    const manifest = JSON.parse(fs.readFileSync(templatePath, 'utf-8')) as DxtManifest;

    const edgeRepository = new EdgeRepository(edgesPath);
    const edgeService = new EdgeService(edgeRepository);
    const edges = (await edgeService.getEdges())
        .filter(edge => filter.length > 0 ? filter.includes(edge.name.toLowerCase()) : true);

    for (const edge of edges) {
        const names = getNames(edge);
        const descriptions = getDescriptions(edge);

        manifest.tools.push({
            name: names.getApiEndpoints,
            description: descriptions.getApiEndpoints,
        }, {
            name: names.getApiEndpointDetails,
            description: descriptions.getApiEndpointDetails,
        }, {
            name: names.callApiEndpoint,
            description: descriptions.callApiEndpoint,
        });

        for (const config of edge.configuration) {
            manifest.server.mcp_config.env = {
                ...manifest.server.mcp_config.env,
                [config.name]: `\${user_config.${config.name}}`,
            }

            manifest.user_config = {
                ...manifest.user_config,
                [config.name]: {
                    type: 'string',
                    title: config.description,
                    description: config.description,
                    require: true,
                    sensitive: config.sensitive,
                },
            }
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 4));
})()
