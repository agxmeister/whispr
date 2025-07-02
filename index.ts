import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import {z as zod} from "zod";
import axios from 'axios';
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
    data: zod.string().optional()
        .describe("JSON-encoded parameters, if needed"),
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

const getEndpoints = async (): Promise<Endpoint[]> =>
    Object.entries(
        dereferenceSync(
            (await axios.get(`${process.env.API_BASE_URL}/modules/wp-toolkit/v1/specification/public`))
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

server.tool(
    "wp-toolkit-api-endpoints",
    "Provides a list of REST API endpoints for managing WordPress websites. Before using an endpoint, check its details.",
    async () => ({
        content: [{
            type: "text",
            text: (await getEndpoints())
                .map(({method, path, details}) =>
                    `${method} ${path} - ${details.summary ?? details.description}`,
                )
                .join("\n\n"),
        }]
    })
);

server.tool(
    "wp-toolkit-api-endpoint-details",
    "Provides details on a specific REST API endpoint to manage WordPress websites.",
    wpToolkitApiEndpointDetailsSchema.shape,
    async ({endpoint}) => {
        const target = (await getEndpoints())
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
    "wp-toolkit-api",
    "Request a specific REST API endpoint to manage WordPress websites. Before using an endpoint, check its details.",
    wpToolkitApiRequestSchema.shape,
    async ({endpoint, data}) => {
        try {
            const response = await axios({
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.API_KEY,
                },
                method: endpoint.method,
                url: `${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint.path}`,
                data: JSON.parse(data || "{}"),
            })
            return {
                content: [{
                    type: "text",
                    text: `HTTP code ${response.status}, response body:\n\n${JSON.stringify(response.data, null, 2)}`,
                }],
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

const transport = new StdioServerTransport();

(async () => {
    await server.connect(transport);
})();
