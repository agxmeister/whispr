import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
import { container } from "@/container";
import { dependencies } from "@/dependencies";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpService } from "@/modules/mcp";
import { MiddlewareDiscovery } from "@/modules/mcp/middleware";

dotenv.config();

(async () => {
    const middlewareDiscovery = container.get<MiddlewareDiscovery>(dependencies.MiddlewareDiscovery);
    await middlewareDiscovery.discover(path.join(__dirname, 'middlewares'));

    const mcpService = container.get<McpService>(dependencies.McpService);
    const server = await mcpService.getMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
