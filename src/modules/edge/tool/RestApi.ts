import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {getApiEndpointDescription, getOpenApiEndpoints} from "./utils";
import {OpenApiEndpointRoute} from "@/modules/edge/tool/types";

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

    async getEndpointDetails(route: OpenApiEndpointRoute) {
        const target = (await getOpenApiEndpoints(this.edge.api.specification))
            .filter((endpoint) =>
                endpoint.route.path === route.path && endpoint.route.method === route.method
            ).shift();

        if (!target) {
            return {
                content: [{
                    type: "text",
                    text: `Endpoint ${route.method} ${route.path} does not exists.`,
                }],
                isError: true,
            };
        }

        return {
            content: [{
                type: "text",
                text: `${target.route.method} ${target.route.path} - ${target.definition.description}
        ${target.definition.parameters
                    ? `\n\nParameters:\n\n${JSON.stringify(target.definition.parameters, null, 2)}`
                    : "\n\nNo parameters expected."}
        ${target.definition.requestBody
                    ? `\n\nRequest body:\n\n${JSON.stringify(target.definition.requestBody, null, 2)}`
                    : "\n\nRequest body must be empty."}`,
            }]
        }
    }

    async callEndpoint(endpoint: { method: string; path: string }, placeholders?: Record<string, string>, parameters?: string, body?: string) {
        try {
            const path = Object.entries(placeholders || {}).reduce(
                (path, [key, value]) => path
                    .split(`{${key}}`)
                    .join(value),
                endpoint.path,
            );

            const config: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    ...this.edge.api.request.headers,
                },
                method: endpoint.method,
                url: `${this.edge.api.request.url}${path}?${parameters || ""}`,
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