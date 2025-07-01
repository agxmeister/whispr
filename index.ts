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

server.tool(
    "wp-toolkit-api-how-to",
    "Provides the comprehensive instruction on how to manage WordPress websites using WP Toolkit REST API.",
    async () => {

        const response = await axios.get(`${process.env.API_BASE_URL}/modules/wp-toolkit/v1/specification/public`);
        const schema = dereferenceSync(response.data);

        const calls = Object.entries((schema as any).paths)
            .filter(([path]) => [
                "/v1/installations",
                "/v1/installations/{installationId}",
                "/v1/installations/{installationId}/features/debug/status",
                "/v1/installations/{installationId}/features/debug/settings",
                "/v1/installations/{installationId}/features/maintenance/status",
                "/v1/installations/{installationId}/features/maintenance/settings",
                "/v1/installations/{installationId}/backups/meta",
                "/v1/features/backups/creator",
                "/v1/features/backups/restorer",
            ].includes(path))
            .reduce(
                (acc: any[], [path, pathData]: [string, any]) =>
                    [...acc, ...Object.entries(pathData).map(([method, methodData]) => [path, method, methodData])],
                [])
            .map(([path, method, methodData]: [string, string, any]) =>
                `${method.toUpperCase()} ${path} - ${methodData.description}.\nRequest body schema: ${methodData.requestBody ? JSON.stringify(methodData.requestBody.content['application/json'].schema, null, 2) : "none"}`
            );

        return {
            content: [{
                type: "text",
                text: calls.join("\n\n"),
            }]
        }
    }
);

const wpToolkitApiSchema = zod.object({
    method: zod.enum(["GET", "POST", "PUT", "PATCH"]).describe("HTTP method to use for the API call, e.g., GET, PUT."),
    endpoint: zod.string().describe("API endpoint to call, e.g., /v1/installations"),
    data: zod.string().describe("JSON-encoded parameters for the request body, if required."),
})

server.tool(
    "wp-toolkit-api",
    "Performs the given API call to WP Toolkit. Important: read the how-to before use.",
    wpToolkitApiSchema.shape,
    async ({method, endpoint, data}) => {
        try {
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-API-Key": process.env.API_KEY,
            }

            const params = JSON.parse(data || "{}");

            let response;
            if (method === "GET") {
                response = await axios.get(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, {
                    headers,
                    validateStatus: () => true,
                });
            } else if (method === "POST") {
                response = await axios.post(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, params, {
                    headers,
                    validateStatus: () => true,
                });
            } else if (method === "PUT") {
                response = await axios.put(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, params, {
                    headers,
                    validateStatus: () => true,
                });
            } else if (method === "PATCH") {
                response = await axios.patch(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, params, {
                    headers,
                    validateStatus: () => true,
                });
            }

            if (!response || !response.data) {
                return {
                    content: [{
                        type: "text",
                        text: `No response data received from the API.`,
                    }],
                    metadata: {
                        statusCode: response ? response.status : null,
                        headers: response ? response.headers : null,
                        data: null
                    }
                };
            }

            return {
                content: [{
                    type: "text",
                    text: `Status Code: ${response.status}\n\nResponse Body:\n${JSON.stringify(response.data, null, 2)}`,
                }],
                metadata: {
                    statusCode: response.status,
                    headers: response.headers,
                    data: response.data
                }
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    content: [{
                        type: "text",
                        text: `Error making request: ${error.message}`,
                    }],
                    metadata: {
                        error: error.message,
                        code: error.code
                    }
                };
            }

            return {
                content: [{
                    type: "text",
                    text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
                }],
                metadata: {
                    error: error instanceof Error ? error.message : String(error)
                }
            };
        }
    }
);

const transport = new StdioServerTransport();

(async () => {
    await server.connect(transport);
})();
