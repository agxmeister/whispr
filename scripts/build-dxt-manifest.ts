import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import {getServices} from "../src/utils";
import {getNames, getDescriptions} from "../src/server/tools";

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
const servicesPath = args.services
    ? path.resolve(args.services)
    : undefined;
const filter = args.filter
    ? args.filter.split(',').map((service: string) => service.trim().toLowerCase())
    : [];

(async () => {
    const manifest = JSON.parse(fs.readFileSync(templatePath, 'utf-8')) as DxtManifest;

    const services = (await getServices(servicesPath))
        .filter(service => filter.length > 0 ? filter.includes(service.name.toLowerCase()) : true);

    for (const service of services) {
        const names = getNames(service);
        const descriptions = getDescriptions(service);

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

        for (const config of service.configuration) {
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
