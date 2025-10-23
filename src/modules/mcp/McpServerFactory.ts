import {injectable, inject} from "inversify";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {EdgeService} from "@/modules/edge";
import {EdgeToolService} from "@/modules/edge/tool";
import {AssistantService} from "@/modules/assistant";
import {McpServerFactory as McpServerFactoryInterface} from "./types";
import {ProcessorFactory} from "@/modules/tool/processor/types";
import {MiddlewaresFactory} from "@/modules/tool/middleware";
import {dependencies} from "@/dependencies";

@injectable()
export class McpServerFactory implements McpServerFactoryInterface {
    constructor(
        @inject(dependencies.EdgeService) private readonly edgeService: EdgeService,
        @inject(dependencies.EdgeToolService) private readonly edgeToolService: EdgeToolService,
        @inject(dependencies.AssistantService) private readonly assistantService: AssistantService,
        @inject(dependencies.EdgeToolMiddlewaresFactory) private readonly middlewaresFactory: MiddlewaresFactory,
        @inject(dependencies.ProcessorFactory) private readonly processorFactory: ProcessorFactory
    ) {}

    public async create(): Promise<McpServer> {
        const server = new McpServer({
            name: "whispr",
            version: "1.0.0",
        });

        const edges = await this.edgeService.getAll();
        const toolFactories = await this.edgeToolService.getEdgeToolFactories();
        const assistants = await this.assistantService.getAssistants();

        for (const edge of edges) {
            for (const factory of toolFactories) {
                const tool = await factory.create(edge);
                const middlewares = await this.middlewaresFactory.create(edge, tool);
                const processor = await this.processorFactory.create(tool, middlewares);
                server.tool(tool.name, tool.description, tool.schema, processor.handler);
            }
        }

        for (const assistant of assistants) {
            for (const tool of assistant.tools) {
                server.tool(tool.name, tool.description, tool.schema, tool.handler.bind(tool));
            }
        }

        return server;
    }
}