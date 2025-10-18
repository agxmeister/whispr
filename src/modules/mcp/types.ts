import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";

export interface McpServerFactory {
    create(): Promise<McpServer>;
}
