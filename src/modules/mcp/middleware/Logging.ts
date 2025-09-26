import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Middleware, MiddlewareContext, MiddlewareNext } from "../types";
import { Logger } from "../../logger/types";

export class LoggingMiddleware implements Middleware {
    constructor(private logger: Logger) {}

    async processInput(context: MiddlewareContext, next: MiddlewareNext): Promise<CallToolResult> {
        this.logger.info({
            tool: context.toolName,
            args: context.args,
        }, `Tool ${context.toolName} started`);

        const startTime = Date.now();

        try {
            const result = await next();
            const duration = Date.now() - startTime;

            this.logger.info({
                tool: context.toolName,
                duration: duration,
                success: true
            }, `Tool ${context.toolName} completed`);

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;

            this.logger.error({
                tool: context.toolName,
                duration: duration,
                error: error instanceof Error ? error.message : String(error),
                success: false
            }, `Tool ${context.toolName} failed`);

            throw error;
        }
    }
}