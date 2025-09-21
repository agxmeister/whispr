import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool, Middleware, MiddlewareContext} from "./types";

export class Processor implements Tool {
    constructor(private readonly tool: Tool, private readonly middlewares: Middleware[] = []) {}

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
        let context: MiddlewareContext = {
            toolName: this.tool.name,
            args,
            metadata: {}
        };

        const processedMiddlewares: Middleware[] = [];

        for (const middleware of this.middlewares) {
            if (middleware.processInput) {
                context = await middleware.processInput(context);
                processedMiddlewares.push(middleware);
            }
        }

        let result = await this.tool.handler(...context.args);

        while (processedMiddlewares.length > 0) {
            const middleware = processedMiddlewares.pop()!;
            if (middleware.processOutput) {
                result = await middleware.processOutput(context, result);
            }
        }

        return result;
    }
}