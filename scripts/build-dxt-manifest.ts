import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import {EdgeService, EdgeRepository} from "../src/modules/edge";
import {ConfigService, ConfigRepository} from "../src/modules/config";
import {ProfileService} from "../src/modules/profile";
import {CallApiEndpointFactory, GetApiEndpointsFactory, GetApiEndpointDetailsFactory} from "../src/modules/edge/tool";

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
const configPath = args.config
    ? path.resolve(args.config)
    : path.join(__dirname, '../config.json');
const filter = args.filter
    ? args.filter.split(',').map((edge: string) => edge.trim().toLowerCase())
    : [];

(async () => {
    const manifest = JSON.parse(fs.readFileSync(templatePath, 'utf-8')) as DxtManifest;

    const configRepository = new ConfigRepository(configPath);
    const configService = new ConfigService(configRepository);
    const profileService = new ProfileService(configService);
    const edgeRepository = new EdgeRepository(configService);
    const edgeService = new EdgeService(edgeRepository);
    const edges = (await edgeService.getEdges())
        .filter(edge => filter.length > 0 ? filter.includes(edge.name.toLowerCase()) : true);

    for (const edge of edges) {
        const getApiEndpointsTool = await new GetApiEndpointsFactory(profileService).create(edge);
        const getApiEndpointDetailsTool = await new GetApiEndpointDetailsFactory(profileService).create(edge);
        const callApiEndpointTool = await new CallApiEndpointFactory(profileService).create(edge);

        manifest.tools.push({
            name: getApiEndpointsTool.getName(),
            description: getApiEndpointsTool.getDescription(),
        }, {
            name: getApiEndpointDetailsTool.getName(),
            description: getApiEndpointDetailsTool.getDescription(),
        }, {
            name: callApiEndpointTool.getName(),
            description: callApiEndpointTool.getDescription(),
        });

        if (!edge.environment) {
            continue;
        }
        
        for (const config of edge.environment) {
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
