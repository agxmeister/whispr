import * as fs from 'fs';
import * as path from 'path';
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

const rootDir = path.resolve(__dirname, '..');
const templatePath = path.join(rootDir, 'manifest.json.tmpl');
const outputPath = path.join(rootDir, 'manifest.json');

(async () => {
    const manifest = JSON.parse(fs.readFileSync(templatePath, 'utf-8')) as Manifest;

    for (const service of (await getServices())) {
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
