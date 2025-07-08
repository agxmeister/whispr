import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {getOpenApiEndpoints, getServices} from "./utils";
import axios, {AxiosRequestConfig} from "axios";
import {callApiEndpointSchema, getApiEndpointDetailsSchema} from "./schemas";

export const getServer = async () => {
    const server = new McpServer({
        name: "whispr",
        version: "1.0.0"
    });

    for (const service of (await getServices())) {
        server.tool(
            `${service.name}-get-api-endpoints`,
            `${service.tool.getApiEndpoints}`,
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

        server.tool(
            `${service.name}-get-api-endpoint-details`,
            `${service.tool.getApiEndpointDetails}`,
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

        server.tool(
            `${service.name}-call-api-endpoint`,
            `${service.tool.callApiEndpoint}`,
            callApiEndpointSchema.shape,
            async ({endpoint, parameters, body}) => {
                try {
                    const config: AxiosRequestConfig = {
                        headers: {
                            "Content-Type": "application/json",
                            [service.authorization.key]: service.authorization.value,
                        },
                        method: endpoint.method,
                        url: `${service.url.api}${endpoint.path}?${parameters || ""}`,
                        data: body ? JSON.parse(body) : undefined,
                        maxRedirects: 0,
                        validateStatus: (status) => status < 500,
                    };
                    const response = await axios(config);
                    return {
                        content: [{
                            type: "text",
                            text: `HTTP code ${response.status}, response body:\n\n${JSON.stringify(response.data, null, 2)}`,
                        }],
                        isError: response.status >= 400,
                    };
                } catch (error) {
                    return {
                        content: [{
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        }],
                        isError: true,
                    };
                }
            }
        );
    }

    return server;
}
