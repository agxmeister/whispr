import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../types";

export interface McpServerBuilder {
    addService(service: Service): this;
    build(): McpServer;
}
