import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {getOpenApiEndpoints} from "./utils";
import {OpenApiEndpointRoute, Parameter} from "./types";
import {Result, success, failure} from "@/modules/tool";
export class Rest {
    constructor(private readonly edge: Edge, private readonly profile: Profile) {}

    async listEndpoints(): Promise<Result<any>> {
        try {
            const endpoints = await getOpenApiEndpoints(this.edge.api.specification, this.profile.readonly);

            return success(endpoints.map((openApiEndpoint) => ({
                route: openApiEndpoint.route,
                summary: openApiEndpoint.definition.summary ?? openApiEndpoint.definition.description,
            })));
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    async getEndpointDetails(route: OpenApiEndpointRoute): Promise<Result<any>> {
        try {
            const target = (await getOpenApiEndpoints(this.edge.api.specification))
                .filter((endpoint) =>
                    endpoint.route.path === route.path && endpoint.route.method === route.method.toLowerCase()
                ).shift();

            if (!target) {
                return failure({
                    error: `Endpoint ${route.method.toLowerCase()} ${route.path} does not exist.`
                });
            }

            return success({
                route: target.route,
                summary: target.definition.summary || null,
                description: target.definition.description || null,
                parameters: target.definition.parameters
                    ?.filter(parameter => ["query", "path"].includes(parameter.in)) || null,
                body: target.definition.requestBody || null,
            });
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }

    async callEndpoint(route: OpenApiEndpointRoute, pathParameters?: Parameter[], queryParameters?: Parameter[], body?: string): Promise<Result<any>> {
        try {
            const path = (pathParameters || []).reduce(
                (path, pathParam) => path
                    .split(`{${pathParam.key}}`)
                    .join(pathParam.value),
                route.path,
            );

            const query = (queryParameters || [])
                .map(queryParam => `${encodeURIComponent(queryParam.key)}=${encodeURIComponent(queryParam.value)}`)
                .join('&');

            const config: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    ...this.edge.api.request.headers,
                },
                method: route.method.toLowerCase(),
                url: `${this.edge.api.request.url}${path}${query ? `?${query}` : ''}`,
                data: body ? JSON.parse(body) : undefined,
                maxRedirects: 0,
                validateStatus: (status) => status < 500,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
            };

            const response = await axios(config);

            const result = {
                status: response.status,
                body: response.data
            };

            if (response.status >= 400) {
                return failure(result);
            }

            return success(result);
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
}