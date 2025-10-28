import {injectable, inject} from "inversify";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {EdgeService} from "@/modules/edge";
import {EdgeToolService} from "@/modules/edge/tool";
import {AssistantService} from "@/modules/assistant";
import {McpServerFactory as McpServerFactoryInterface} from "./types";
import {ProcessorFactory} from "@/modules/tool/processor/types";
import {MiddlewareService} from "@/modules/tool/middleware";
import {FormatterFactory} from "@/modules/tool/formatter";
import {dependencies} from "@/dependencies";

@injectable()
export class McpServerFactory implements McpServerFactoryInterface {
    constructor(
        @inject(dependencies.EdgeService) private readonly edgeService: EdgeService,
        @inject(dependencies.EdgeToolService) private readonly edgeToolService: EdgeToolService,
        @inject(dependencies.AssistantService) private readonly assistantService: AssistantService,
        @inject(dependencies.MiddlewareService) private readonly middlewareService: MiddlewareService,
        @inject(dependencies.ProcessorFactory) private readonly processorFactory: ProcessorFactory,
        @inject(dependencies.EdgeToolFormatterFactory) private readonly edgeToolFormatterFactory: FormatterFactory,
        @inject(dependencies.AssistantToolFormatterFactory) private readonly assistantToolFormatterFactory: FormatterFactory
    ) {}

    public async create(): Promise<McpServer> {
        const server = new McpServer({
            name: "whispr",
            version: "1.0.0",
        });

        const edges = await this.edgeService.getAll();
        const toolFactories = await this.edgeToolService.getEdgeToolFactories();
        const edgeToolFormatter = this.edgeToolFormatterFactory.create();
        for (const edge of edges) {
            for (const factory of toolFactories) {
                const tool = await factory.create(edge);
                const middlewares = await this.middlewareService.getMiddlewares(edge, tool);
                const processor = await this.processorFactory.create(tool, edgeToolFormatter, middlewares);
                server.tool(tool.name, tool.description, tool.schema, processor.handler);
            }
        }

        const assistants = await this.assistantService.getAssistants();
        const assistantToolFormatter = this.assistantToolFormatterFactory.create();
        for (const assistant of assistants) {
            for (const tool of assistant.tools) {
                const processor = await this.processorFactory.create(tool, assistantToolFormatter);
                server.tool(tool.name, tool.description, tool.schema, processor.handler);
            }
        }

        return server;
    }
}