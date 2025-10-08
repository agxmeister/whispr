import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Tool, Processor as ProcessorInterface} from "./types";
import {Middleware, MiddlewareContext, MiddlewareNext} from "./middleware";
import {formatted} from "./decorators";
import {Profile} from "@/modules/profile";

export class Processor implements ProcessorInterface {
    constructor(
        private readonly tool: Tool,
        private readonly middlewares?: Middleware[],
        private readonly profile?: Profile
    ) {}

    @formatted
    private async callToolHandler(input: any): Promise<any> {
        return await this.tool.handler(input);
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
