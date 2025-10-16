import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool} from "@/modules/mcp/types";
import {Middleware} from "../middleware/types";

export interface ProcessorFactory {
    create(tool: Tool, middlewares?: Middleware[]): Promise<Processor>;
}

export interface Processor {
    readonly handler: (input: any) => Promise<CallToolResult>;
}
