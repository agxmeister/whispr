import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {getApiEndpointDescription, getOpenApiEndpoints} from "./utils";

export class RestApi {
    constructor(private readonly edge: Edge, private readonly profile: Profile) {}

    async listEndpoints() {
        return {
            content: [{
                type: "text",
                text: (await getOpenApiEndpoints(this.edge.api.specification, this.profile.readonly))
                    .map((openApiEndpoint) => getApiEndpointDescription(openApiEndpoint))
                    .join("\n\n"),
            }]
        };
    }

    async getEndpointDetails(endpoint: { method: string; path: string }) {
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

    async callEndpoint(endpoint: { method: string; path: string }, parameters?: string, body?: string) {
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