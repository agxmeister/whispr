import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";

export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (input: any) => Promise<CallToolResult>;
}

export interface McpServerFactory {
    create(): Promise<McpServer>;
}
