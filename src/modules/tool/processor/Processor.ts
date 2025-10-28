import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Profile} from "@/modules/profile";
import {Tool} from "@/modules/tool";
import {Formatter} from "@/modules/tool/formatter";
import {Processor as ProcessorInterface} from "./types";
import {Middleware, MiddlewareContext, MiddlewareNext} from "../middleware";

export class Processor implements ProcessorInterface {
    constructor(
        private readonly tool: Tool,
        private readonly formatter: Formatter,
        private readonly middlewares?: Middleware[],
        private readonly profile?: Profile
    ) {}

    private async callToolHandler(input: any): Promise<CallToolResult> {
        try {
            const payload = await this.tool.handler(input);
            return this.formatter.formatSuccess(payload);
        } catch (error) {
            return this.formatter.formatFailure(error instanceof Error ? error : new Error(String(error)));
        }
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
