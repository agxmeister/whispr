import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool, Middleware, MiddlewareContext, MiddlewareNext} from "./types";

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
        const context: MiddlewareContext = {
            toolName: this.tool.name,
            args,
            metadata: {}
        };

        const processedMiddlewares: Middleware[] = [];

        const getNext = (index: number): MiddlewareNext => {
            return async (): Promise<CallToolResult> => {
                if (index < this.middlewares.length) {
                    const middleware = this.middlewares[index];
                    if (middleware.processInput) {
                        processedMiddlewares.push(middleware);
                        return await middleware.processInput(context, getNext(index + 1));
                    } else {
                        return await getNext(index + 1)();
                    }
                } else {
                    let result = await this.tool.handler(...context.args);

                    while (processedMiddlewares.length > 0) {
                        const middleware = processedMiddlewares.pop()!;
                        if (middleware.processOutput) {
                            result = await middleware.processOutput(context, result);
                        }
                    }

                    return result;
                }
            };
        };

        return await getNext(0)();
    }
}