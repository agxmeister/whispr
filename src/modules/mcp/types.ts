import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";

export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (...args: any[]) => Promise<CallToolResult>;
}

export interface MiddlewareContext {
    toolName: string;
    args: any[];
    metadata?: Record<string, any>;
}

export interface Middleware {
    processInput?(context: MiddlewareContext): Promise<MiddlewareContext>;
    processOutput?(context: MiddlewareContext, result: CallToolResult): Promise<CallToolResult>;
}
