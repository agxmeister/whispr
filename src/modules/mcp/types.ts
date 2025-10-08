import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Middleware} from "./middleware/types";

export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (input: any) => Promise<CallToolResult>;
}

export interface ProcessorFactory {
    create(tool: Tool, middlewares?: Middleware[]): Promise<Processor>;
}

export interface Processor {
    readonly handler: (input: any) => Promise<CallToolResult>;
}
