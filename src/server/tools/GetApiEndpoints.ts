import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";
import {Tool} from "./types";
import {getNames, getDescriptions, getOpenApiEndpoints} from "./utils";

export const GetApiEndpoints: Tool = {
    attach: (service: Service, server: McpServer) => {
        server.tool(
            `${getNames(service).getApiEndpoints}`,
            `${getDescriptions(service).getApiEndpoints}`,
            async () => ({
                content: [{
                    type: "text",
                    text: (await getOpenApiEndpoints(service.api.specification))
                        .map(({method, path, details}) =>
                            `${method} ${path} - ${details.summary ?? details.description}`,
                        )
                        .join("\n\n"),
                }]
            })
        );
    }
}
