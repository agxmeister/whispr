import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Edge } from "@/modules/edge";
import { Tool } from "@/modules/tool";

export interface MiddlewareContext {
    tool: string;
    input: Record<string, any>;
    metadata: Record<string, any>;
}

export interface MiddlewareNext {
    (): Promise<CallToolResult>;
}

export interface Middleware {
    processInput?(context: MiddlewareContext, next: MiddlewareNext): Promise<CallToolResult>;
    processOutput?(context: MiddlewareContext, result: CallToolResult): Promise<CallToolResult>;
}

export interface MiddlewareFactory {
    create(): Promise<Middleware>;
}

export interface MiddlewareService {
    getMiddlewares(edge: Edge, tool: Tool): Promise<Middleware[]>;
}

export type MiddlewareFactoryConstructor = new (...args: any[]) => MiddlewareFactory;
