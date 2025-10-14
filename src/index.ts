import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {McpService} from "@/modules/mcp";
import {MiddlewareDiscovery} from "@/modules/mcp/middleware";
import { container } from "@/container";
import { dependencies } from "@/dependencies";

dotenv.config();

(async () => {
    const middlewareDiscovery = new MiddlewareDiscovery();
    await middlewareDiscovery.discover(path.join(__dirname, 'middlewares'));

    const mcpService = container.get<McpService>(dependencies.McpService);
    const server = await mcpService.getMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
