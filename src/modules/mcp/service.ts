import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Edge} from "@/modules/edge";
import {EdgeToolFactory} from "@/modules/edge/tool";
import {AssistantFactory} from "@/modules/assistant";
import {ProcessorFactory} from "./types";
import {EdgeToolMiddlewaresFactory} from "./middleware";

export class McpService {
    constructor(private readonly processorFactory: ProcessorFactory) {}

    public async getMcpServer(
        edges: Edge[],
        toolFactories: EdgeToolFactory[],
        middlewaresFactory: EdgeToolMiddlewaresFactory,
        assistantFactories: AssistantFactory[] = []
    ): Promise<McpServer> {
        const server = new McpServer({
            name: "whispr",
            version: "1.0.0",
        });

        for (const edge of edges) {
            for (const factory of toolFactories) {
                const tool = await factory.create(edge);
                const middlewares = middlewaresFactory.create(edge, tool);
                const processor = this.processorFactory.create(tool, middlewares);
                server.tool(tool.name, tool.description, tool.schema, processor.handler);
            }
        }

        for (const factory of assistantFactories) {
            const assistant = factory.create();
            const tools = assistant.getTools();
            for (const tool of tools) {
                server.tool(tool.name, tool.description, tool.schema, tool.handler.bind(tool));
            }
        }

        return server;
    }
}