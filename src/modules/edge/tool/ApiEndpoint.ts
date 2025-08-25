import {z as zod} from "zod";
import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {EdgeTool} from "./EdgeTool";
import {apiEndpointSchema} from "./schemas";
import {getApiEndpointDescription, getOpenApiEndpoints} from "./utils";

export class ApiEndpoint extends EdgeTool {
    getName(): string {
        return `${this.edge.name.toLowerCase()}-api`;
    }

    getDescription(): string {
        return `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. A typical workflow is to list available ${this.edge.name} endpoints, get endpoint details, and then call endpoints. Do not call an endpoint before scrutinizing how to use it properly!`;
    }

    getSchema() {
        return apiEndpointSchema.shape;
    }

    getHandler() {
        return async (params: zod.infer<typeof apiEndpointSchema>) => {
            const action = params.action;

            if (action.type === "list-endpoints") {
                return await this.listEndpoints();
            }

            if (action.type === "get-endpoint-details") {
                return await this.getEndpointDetails(action.endpoint);
            }

            if (action.type === "call-endpoint") {
                return await this.callEndpoint(action.endpoint, action.parameters, action.body);
            }
        };
    }

    private async listEndpoints() {
        return {
            content: [{
                type: "text",
                text: (await getOpenApiEndpoints(this.edge.api.specification, this.profile.readonly))
                    .map((openApiEndpoint) => getApiEndpointDescription(openApiEndpoint))
                    .join("\n\n"),
            }]
        };
    }

    private async getEndpointDetails(endpoint: { method: string; path: string }) {
        const target = (await getOpenApiEndpoints(this.edge.api.specification))
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

    private async callEndpoint(endpoint: { method: string; path: string }, parameters?: string, body?: string) {
        try {
            const config: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    ...this.edge.api.request.headers,
                },
                method: endpoint.method,
                url: `${this.edge.api.request.url}${endpoint.path}?${parameters || ""}`,
                data: body ? JSON.parse(body) : undefined,
                maxRedirects: 0,
                validateStatus: (status) => status < 500,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
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
}