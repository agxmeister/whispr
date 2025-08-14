import dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {EdgeService, EdgeRepository} from "./modules/edge";
import {McpService} from "./modules/mcp";
import {CallApiEndpointFactory, GetApiEndpointDetailsFactory, GetApiEndpointsFactory} from "./modules/tool";

dotenv.config();
const args = minimist(process.argv.slice(2));

(async () => {
    const edgeRepository = new EdgeRepository(args.edges
        ? path.resolve(args.edges)
        : path.join(__dirname, '../edges.json')
    );
    const edgeService = new EdgeService(edgeRepository);
    const edges = await edgeService.getEdges();
    const serverService = new McpService();
    const server = serverService.getMcpServer(edges, [
        new GetApiEndpointsFactory(),
        new GetApiEndpointDetailsFactory(),
        new CallApiEndpointFactory(),
    ]);
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
