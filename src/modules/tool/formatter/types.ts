import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";

export interface FormatterFactory {
    create(): Formatter;
}

export interface Formatter {
    formatSuccess(result: any): CallToolResult;
    formatFailure(error: Error): CallToolResult;
}
