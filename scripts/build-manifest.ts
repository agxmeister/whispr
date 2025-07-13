import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import {getServices} from "../src/utils";

type Manifest = {
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
    : path.join(rootDir, 'manifest.json.tmpl');
const outputPath = args.output
    ? path.resolve(args.output)
    : path.join(rootDir, 'manifest.json');
const filterServices = args.services
    ? args.services.split(',').map((service: string) => service.trim())
    : [];
const configPath = args.config
    ? path.resolve(args.config)
    : undefined;

(async () => {
    const manifest = JSON.parse(fs.readFileSync(templatePath, 'utf-8')) as Manifest;

    const services = (await getServices(configPath))
        .filter(service => filterServices.length > 0 ? filterServices.includes(service.name) : true);

    for (const service of services) {
        manifest.tools.push({
            name: `${service.name}-get-api-endpoints`,
            description: service.tool.getApiEndpoints,
        }, {
            name: `${service.name}-get-api-endpoint-details`,
            description: service.tool.getApiEndpointDetails,
        }, {
            name: `${service.name}-call-api-endpoint`,
            description: service.tool.callApiEndpoint,
        });

        for (const config of service.config) {
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
