import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool} from "@/modules/tool";
import {Middleware} from "@/modules/tool/middleware/types";
import {Formatter} from "@/modules/tool/formatter";

export interface ProcessorFactory {
    create(tool: Tool, formatter: Formatter, middlewares?: Middleware[]): Promise<Processor>;
}

export interface Processor {
    readonly handler: (input: any) => Promise<CallToolResult>;
}
