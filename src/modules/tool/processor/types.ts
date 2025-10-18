import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool} from "@/modules/tool";
import {Middleware} from "@/modules/tool/middleware/types";

export interface ProcessorFactory {
    create(tool: Tool, middlewares?: Middleware[]): Promise<Processor>;
}

export interface Processor {
    readonly handler: (input: any) => Promise<CallToolResult>;
}
