import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool} from "./types";

export class Processor implements Tool {
    constructor(private readonly tool: Tool) {}

    get name(): string {
        return this.tool.name;
    }

    get description(): string {
        return this.tool.description;
    }

    get schema(): any {
        return this.tool.schema;
    }

    async handler(...args: any[]): Promise<CallToolResult> {
        return await this.tool.handler(...args);
    }
}