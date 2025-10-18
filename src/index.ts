import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
import { container } from "@/container";
import { dependencies } from "@/dependencies";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServerFactory } from "@/modules/mcp";
import { MiddlewareDiscovery } from "@/modules/tool/middleware";

dotenv.config();

(async () => {
    const middlewareDiscovery = container.get<MiddlewareDiscovery>(dependencies.MiddlewareDiscovery);
    await middlewareDiscovery.discover(path.join(__dirname, 'middlewares'));

    const mcpServerFactory = container.get<McpServerFactory>(dependencies.McpServerFactory);
    const server = await mcpServerFactory.create();
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
