import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../types";
import {Tool} from "./tools";
import {McpServerBuilder} from "./types";

export class RestMcpServerBuilder implements McpServerBuilder
{
    private readonly server: McpServer;

    constructor(readonly tools: Tool[]) {
        this.server = new McpServer({
            name: "whispr",
            version: "1.0.0"
        });
    }

    public addService(service: Service): this {
        for (const tool of this.tools) {
            tool.attach(service, this.server);
        }
        return this;
    }

    public build(): McpServer {
        return this.server;
    }
}
