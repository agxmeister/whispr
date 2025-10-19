import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Profile} from "@/modules/profile";
import {Tool} from "@/modules/tool";
import {Processor as ProcessorInterface} from "./types";
import {Middleware, MiddlewareContext, MiddlewareNext} from "../middleware";
import {HttpError} from "@/modules/rest";

export class Processor implements ProcessorInterface {
    constructor(
        private readonly tool: Tool,
        private readonly middlewares?: Middleware[],
        private readonly profile?: Profile
    ) {}

    private async callToolHandler(input: any): Promise<CallToolResult> {
        try {
            const payload = await this.tool.handler(input);
            return this.formatToolResponse(payload);
        } catch (error) {
            return this.formatToolError(error instanceof Error ? error : new Error(String(error)));
        }
    }

    private formatToolResponse(payload: any): CallToolResult {
        return {
            content: [{
                type: "text",
                text: JSON.stringify(payload, null, 2),
            }]
        };
    }

    private formatToolError(error: Error): CallToolResult {
        if (error instanceof HttpError) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        status: error.status,
                        body: error.body
                    }, null, 2),
                }],
                isError: true,
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    error: error.message
                }, null, 2),
            }],
            isError: true,
        };
    }

    readonly handler = async (input: any): Promise<CallToolResult> => {
        const context: MiddlewareContext = {
            tool: this.tool.name,
            input,
            metadata: {...(this.profile?.metadata || {})}
        };

        const processedMiddlewares: Middleware[] = [];

        const getNext = (index: number): MiddlewareNext => {
            return async (): Promise<CallToolResult> => {
                if (this.middlewares && index < this.middlewares.length) {
                    const middleware = this.middlewares[index];
                    if (middleware.processInput) {
                        processedMiddlewares.push(middleware);
                        return await middleware.processInput(context, getNext(index + 1));
                    } else {
                        return await getNext(index + 1)();
                    }
                } else {
                    let result = await this.callToolHandler(context.input);

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
