import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { LoggerFactory } from "@/modules/logger";
import { Middleware, MiddlewareContext, MiddlewareNext, MiddlewareFactory, RegisterMiddlewareFactory } from "@/modules/tool/middleware";
import { injectable, inject } from "inversify";
import { dependencies } from "@/dependencies";

@injectable()
@RegisterMiddlewareFactory("logging")
export class LoggingFactory implements MiddlewareFactory {
    constructor(@inject(dependencies.LoggerFactory) private loggerFactory: LoggerFactory) {}

    async create(): Promise<Middleware> {
        return new Logging(this.loggerFactory);
    }
}

export class Logging implements Middleware {
    private logger;

    constructor(private loggerFactory: LoggerFactory) {
        this.logger = this.loggerFactory.create();
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