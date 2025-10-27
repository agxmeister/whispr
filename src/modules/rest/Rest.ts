import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {getOpenApiEndpoints} from "./utils";
import {OpenApiEndpointRoute, Parameter} from "./types";
export class Rest {
    constructor(private readonly edge: Edge, private readonly profile: Profile) {}

    async listEndpoints() {
        const endpoints = await getOpenApiEndpoints(this.edge.api.specification, this.profile.readonly);

        return endpoints.map((openApiEndpoint) => ({
            route: openApiEndpoint.route,
            summary: openApiEndpoint.definition.summary ?? openApiEndpoint.definition.description,
        }));
    }

    async getEndpointDetails(route: OpenApiEndpointRoute) {
        const target = (await getOpenApiEndpoints(this.edge.api.specification))
            .filter((endpoint) =>
                endpoint.route.path === route.path && endpoint.route.method === route.method.toLowerCase()
            ).shift();

        if (!target) {
            throw new Error(`Endpoint ${route.method.toLowerCase()} ${route.path} does not exist.`);
        }

        return {
            route: target.route,
            summary: target.definition.summary || null,
            description: target.definition.description || null,
            parameters: target.definition.parameters
                ?.filter(parameter => ["query", "path"].includes(parameter.in)) || null,
            body: target.definition.requestBody || null,
        };
    }

    async callEndpoint(route: OpenApiEndpointRoute, pathParameters?: Parameter[], queryParameters?: Parameter[], body?: string) {
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

        return {
            status: response.status,
            body: response.data
        };
    }
}