import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Edge} from "@/modules/edge";
import {EdgeToolFactory} from "@/modules/edge/tool";
import {AssistantFactory} from "@/modules/assistant";
import {ProcessorFactory, Middleware} from "./types";

export class McpService {
    constructor(private readonly processorFactory: ProcessorFactory) {}

    public async getMcpServer(edges: Edge[], edgeToolFactories: EdgeToolFactory[], assistantFactories: AssistantFactory[] = [], middlewares: Middleware[] = []): Promise<McpServer> {
        const server = new McpServer({
            name: "whispr",
            version: "1.0.0",
        });

        for (const edge of edges) {
            for (const factory of edgeToolFactories) {
                const tool = await factory.create(edge);
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