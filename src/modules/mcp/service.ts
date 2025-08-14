import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Edge} from "../edge";
import {EdgeToolFactory} from "../tool/types";

export class McpService {
    public getMcpServer(edges: Edge[], edgeToolFactories: EdgeToolFactory[]): McpServer {
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

        return server;
    }
}