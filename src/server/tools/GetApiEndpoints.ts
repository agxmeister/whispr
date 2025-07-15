import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";
import {Tool} from "./types";
import {getDescriptions, getOpenApiEndpoints} from "./utils";

export const GetApiEndpoints: Tool = {
    attach: (service: Service, server: McpServer) => {
        server.tool(
            `${service.name}-get-api-endpoints`,
            `${getDescriptions(service).getApiEndpoints}`,
            async () => ({
                content: [{
                    type: "text",
                    text: (await getOpenApiEndpoints(service.url.specification))
                        .map(({method, path, details}) =>
                            `${method} ${path} - ${details.summary ?? details.description}`,
                        )
                        .join("\n\n"),
                }]
            })
        );
    }
}
