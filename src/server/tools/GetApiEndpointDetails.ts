import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";
import {getApiEndpointDetailsSchema} from "./schemas";
import {Tool} from "./types";
import {getDescriptions, getOpenApiEndpoints} from "./utils";

export const GetApiEndpointDetails: Tool = {
    attach: (service: Service, server: McpServer) => {
        server.tool(
            `${service.name}-get-api-endpoint-details`,
            `${getDescriptions(service).getApiEndpointDetails}`,
            getApiEndpointDetailsSchema.shape,
            async ({endpoint}) => {
                const target = (await getOpenApiEndpoints(service.url.specification))
                    .filter(({method, path}) =>
                        path === endpoint.path && method === endpoint.method
                    ).shift();

                if (!target) {
                    return {
                        content: [{
                            type: "text",
                            text: `Endpoint ${endpoint.method} ${endpoint.path} does not exists.`,
                        }],
                        isError: true,
                    };
                }

                return {
                    content: [{
                        type: "text",
                        text: `${target.method} ${target.path} - ${target.details.description}
                    ${target.details.parameters
                            ? `\n\nParameters:\n\n${JSON.stringify(target.details.parameters, null, 2)}`
                            : "\n\nNo parameters expected."}
                    ${target.details.requestBody
                            ? `\n\nRequest body:\n\n${JSON.stringify(target.details.requestBody, null, 2)}`
                            : "\n\nRequest body must be empty."}`,
                    }]
                }
            }
        )
    }
}
