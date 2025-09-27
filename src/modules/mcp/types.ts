import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Middleware} from "./middleware/types";

export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (...args: any[]) => Promise<CallToolResult>;
}

export interface ProcessorFactory {
    create(tool: Tool, middlewares?: Middleware[]): Processor;
}

export interface Processor {
    readonly handler: (...args: any[]) => Promise<CallToolResult>;
}
