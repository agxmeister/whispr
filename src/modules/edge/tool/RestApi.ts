import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {getOpenApiEndpoints} from "./utils";
import {OpenApiEndpointRoute, Parameter} from "@/modules/edge/tool/types";

export class RestApi {
    constructor(private readonly edge: Edge, private readonly profile: Profile) {}

    async listEndpoints() {
        const endpoints = await getOpenApiEndpoints(this.edge.api.specification, this.profile.readonly);
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify(
                    endpoints.map((openApiEndpoint) => ({
                        route: openApiEndpoint.route,
                        summary: openApiEndpoint.definition.summary ?? openApiEndpoint.definition.description,
                    })), null, 2,
                ),
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
                    text: JSON.stringify({
                        error: `Endpoint ${route.method} ${route.path} does not exist.`
                    }, null, 2),
                }],
                isError: true,
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    route: target.route,
                    summary: target.definition.summary || null,
                    description: target.definition.description || null,
                    parameters: target.definition.parameters
                        ?.filter(parameter => ["query", "path"].includes(parameter.in)) || null,
                    body: target.definition.requestBody || null,
                }, null, 2),
            }]
        };
    }

    async callEndpoint(endpoint: { method: string; path: string }, pathParameters?: Parameter[], queryParameters?: Parameter[], body?: string) {
        try {
            const path = (pathParameters || []).reduce(
                (path, pathParam) => path
                    .split(`{${pathParam.key}}`)
                    .join(pathParam.value),
                endpoint.path,
            );

            const query = (queryParameters || [])
                .map(queryParam => `${encodeURIComponent(queryParam.key)}=${encodeURIComponent(queryParam.value)}`)
                .join('&');

            const config: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    ...this.edge.api.request.headers,
                },
                method: endpoint.method,
                url: `${this.edge.api.request.url}${path}${query ? `?${query}` : ''}`,
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