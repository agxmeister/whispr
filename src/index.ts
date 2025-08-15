import dotenv from 'dotenv';
import minimist from 'minimist';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {EdgeService, EdgeRepository} from "./modules/edge";
import {McpService} from "./modules/mcp";
import {CallApiEndpointFactory, GetApiEndpointDetailsFactory, GetApiEndpointsFactory} from "./modules/tool";
import {RatatouilleFactory} from "./modules/assistant/ratatouille";

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
    ], [
        new RatatouilleFactory({
            apiUrl: process.env.ASSISTANT_RATATOUILLE_API_URL || "http://localhost:3000",
            chiefName: process.env.ASSISTANT_RATATOUILLE_CHIEF_NAME || "jarvis"
        }),
    ]);
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
