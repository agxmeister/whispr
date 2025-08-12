import dotenv from 'dotenv';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {getServer, RestMcpServerBuilder} from "./server";
import {CallApiEndpoint, GetApiEndpointDetails, GetApiEndpoints} from "./server/tools";
import minimist from 'minimist';
import path from 'path';
import {getServices} from "./utils";

dotenv.config();
const args = minimist(process.argv.slice(2));

(async () => {
    const serverBuilder = new RestMcpServerBuilder([
        GetApiEndpoints,
        GetApiEndpointDetails,
        CallApiEndpoint,
    ]);
    const services = await getServices(args.services
        ? path.resolve(args.services)
        : undefined
    );
    const server = await getServer(serverBuilder, services);
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
