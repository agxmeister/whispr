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
            tool: context.tool,
            input: context.input,
            metadata: context.metadata,
        }, `Tool ${context.tool} started`);

        context.metadata!.startTime = Date.now();

        return await next();
    }

    async processOutput(context: MiddlewareContext, result: CallToolResult): Promise<CallToolResult> {
        const duration = context.metadata?.startTime ? Date.now() - context.metadata.startTime : 0;

        this.logger.info({
            tool: context.tool,
            duration: duration,
            success: true,
            metadata: context.metadata,
        }, `Tool ${context.tool} completed`);

        return result;
    }
}