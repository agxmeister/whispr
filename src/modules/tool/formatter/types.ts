import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Result} from "@/modules/tool";

export interface FormatterFactory {
    create(): Formatter;
}

export interface Formatter {
    format(result: Result<any>): CallToolResult;
}
