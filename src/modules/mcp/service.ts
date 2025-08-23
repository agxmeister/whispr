import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Edge} from "../edge";
import {EdgeToolFactory} from "../edge/tool";
import {Assistant} from "../assistant";

export class McpService {
    public async getMcpServer(edges: Edge[], edgeToolFactories: EdgeToolFactory[], assistants: Assistant[] = []): Promise<McpServer> {
        const server = new McpServer({
            name: "whispr",
            version: "1.0.0",
        });

        for (const edge of edges) {
            for (const factory of edgeToolFactories) {
                const tool = await factory.create(edge);
                server.tool(tool.getName(), tool.getDescription(), tool.getSchema(), tool.getHandler());
            }
        }

        for (const assistant of assistants) {
            const tools = assistant.getTools();
            for (const tool of tools) {
                server.tool(tool.getName(), tool.getDescription(), tool.getSchema(), tool.getHandler());
            }
        }

        return server;
    }
}