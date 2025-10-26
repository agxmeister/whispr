import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
import { container } from "@/container";
import { dependencies } from "@/dependencies";
import { DiscoveryService } from "@/modules/discovery";
import { McpServerFactory } from "@/modules/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

dotenv.config();

(async () => {
    const discoveryService = container.get<DiscoveryService>(dependencies.DiscoveryService);
    await discoveryService.discover(path.join(__dirname, 'middlewares'));
    await discoveryService.discover(path.join(__dirname, 'assistants'));

    const mcpServerFactory = container.get<McpServerFactory>(dependencies.McpServerFactory);
    const server = await mcpServerFactory.create();
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();
