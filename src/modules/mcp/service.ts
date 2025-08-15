import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Edge} from "../edge";
import {EdgeToolFactory} from "../tool/types";
import {AssistantFactory} from "../assistant";

export class McpService {
    public getMcpServer(edges: Edge[], edgeToolFactories: EdgeToolFactory[], assistantFactories: AssistantFactory[] = []): McpServer {
        const server = new McpServer({
            name: "whispr",
            version: "1.0.0",
        });

        for (const edge of edges) {
            for (const factory of edgeToolFactories) {
                const tool = factory.create(edge);
                server.tool(tool.getName(), tool.getDescription(), tool.getSchema(), tool.getHandler());
            }
        }

        for (const factory of assistantFactories) {
            const assistant = factory.create();
            const tools = assistant.getTools();
            for (const tool of tools) {
                server.tool(tool.getName(), tool.getDescription(), tool.getSchema(), tool.getHandler());
            }
        }

        return server;
    }
}