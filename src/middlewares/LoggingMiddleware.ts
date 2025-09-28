import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { LoggerService } from "@/modules/logger";
import { Middleware, MiddlewareContext, MiddlewareNext, RegisterMiddleware } from "@/modules/mcp/middleware";
import { injectable, inject } from "inversify";
import { dependencies } from "@/container";

@injectable()
@RegisterMiddleware("logging")
export class LoggingMiddleware implements Middleware {
    private logger;

    constructor(@inject(dependencies.LoggerService) private loggerService: LoggerService) {
        this.logger = this.loggerService.getLogger();
    }

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