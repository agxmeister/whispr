import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import {z as zod} from "zod";
import axios, {AxiosRequestConfig} from 'axios';
import {dereferenceSync} from "dereference-json-schema";

dotenv.config();

const server = new McpServer({
    name: "whispr",
    version: "1.0.0"
});

const endpointSchema = zod.object({
    method: zod.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .describe("HTTP method"),
    path: zod.string()
        .describe("Path, e.g., /v1/installations"),
}).describe("REST API endpoint");

const wpToolkitApiEndpointDetailsSchema = zod.object({
    endpoint: endpointSchema,
});

const wpToolkitApiRequestSchema = zod.object({
    endpoint: endpointSchema,
    parameters: zod.string().optional()
        .describe("URL-encoded request parameters, if applicable"),
    body: zod.string().optional()
        .describe("JSON-encoded request body, if applicable"),
})

type Endpoint = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    details: EndpointDetails,
}

type EndpointDetails = {
    summary: string,
    description: string,
    parameters?: [
        Record<string, any>
    ],
    requestBody?: Record<string, any>
}

interface Service {
    name: string,
    url: {
        api: string,
        specification: string,
    },
    authorization: {
        key: string,
        value: string,
    },
    tool: {
        getApiEndpoints: string,
        getApiEndpointDetails: string,
        callApiEndpoint: string,
    },
}

const getEndpoints = async (specificationUrl: string): Promise<Endpoint[]> =>
    Object.entries(
        dereferenceSync(
            (await axios.get(specificationUrl))
                .data
        ).paths
    ).reduce(
        (acc: any[], [path, pathData]: [string, any]) => [
            ...acc,
            ...Object.entries(pathData)
                .map(([method, methodData]: [string, any]) => ({
                    method: method.toUpperCase(),
                    path: path,
                    details: methodData,
                }))
        ],
        []
    );

const services: Service[] = [{
    name: "wp-toolkit",
    url: {
        api: `${process.env.PLESK_API_BASE_URL}/modules/wp-toolkit`,
        specification: `${process.env.PLESK_API_BASE_URL}/modules/wp-toolkit/v1/specification/public`,
    },
    authorization: {
        key: "X-API-Key",
        value: `${process.env.PLESK_API_KEY}`,
    },
    tool: {
        getApiEndpoints: "Provides a list of REST API endpoints for managing WordPress websites. Before using an endpoint, check its details.",
        getApiEndpointDetails: "Provides details on a specific REST API endpoint to manage WordPress websites.",
        callApiEndpoint: "Request a specific REST API endpoint to manage WordPress websites. Before using an endpoint, check its details.",
    },
}, {
    name: "miro",
    url: {
        api: `https://api.miro.com`,
        specification: `https://developers.miro.com/openapi/6628045c567473003e032eba`,
    },
    authorization: {
        key: "Authorization",
        value: `Bearer ${process.env.MIRO_API_KEY}`,
    },
    tool: {
        getApiEndpoints: "Provides a list of REST API endpoints for managing Miro boards. Before using an endpoint, check its details.",
        getApiEndpointDetails: "Provides details on a specific REST API endpoint to manage Miro boards.",
        callApiEndpoint: "Request a specific REST API endpoint to manage Miro boards. Before using an endpoint, check its details.",
    },
}];

for (const service of services) {
    server.tool(
        `${service.name}-get-api-endpoints`,
        `${service.tool.getApiEndpoints}`,
        async () => ({
            content: [{
                type: "text",
                text: (await getEndpoints(service.url.specification))
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
        wpToolkitApiEndpointDetailsSchema.shape,
        async ({endpoint}) => {
            const target = (await getEndpoints(service.url.specification))
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
        wpToolkitApiRequestSchema.shape,
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

const transport = new StdioServerTransport();

(async () => {
    await server.connect(transport);
})();
