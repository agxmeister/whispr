import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";
import {Tool, OpenApiEndpoint} from "./types";
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
                        .map((openApiEndpoint) => getApiEndpointDescription(openApiEndpoint))
                        .join("\n\n"),
                }]
            })
        );
    }
}

const getApiEndpointDescription = ({method, path, details}: OpenApiEndpoint): string => {
    const endpoint = `${method} ${path}`;
    const explanation = details.summary ?? details.description;
    return explanation ? `${endpoint} - ${explanation}` : endpoint;
};
