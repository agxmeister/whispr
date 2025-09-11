import {z as zod} from "zod";

export const apiEndpointRouteSchema = zod.object({
    method: zod.string()
        .describe("HTTP method"),
    path: zod.string()
        .describe("Path, e.g., /rest/api/3/issue/{issueKey}"),
}).describe("REST API endpoint");

export const getApiEndpointsToolSchema = zod.object({
});

export const getApiEndpointDetailsToolSchema = zod.object({
    endpoint: apiEndpointRouteSchema,
});

export const callApiEndpointToolSchema = zod.object({
    endpoint: apiEndpointRouteSchema,
    pathParameters: zod.array(zod.object({
        key: zod.string().describe("The parameter key"),
        value: zod.string().describe("The parameter value")
    })).optional()
        .describe("Array of path parameters to replace placeholders in the path"),
    queryParameters: zod.array(zod.object({
        key: zod.string().describe("The parameter key"),
        value: zod.string().describe("The parameter value")
    })).optional()
        .describe("Array of query parameters to add to the URL"),
    body: zod.string().optional()
        .describe("JSON-encoded request body, if applicable"),
});

export const apiEndpointToolSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-endpoints"),
        })
            .describe("Returns a list of available REST API endpoints."),
        zod.object({
            type: zod.literal("get-endpoint-details"),
            endpoint: zod.object({
                method: zod.string()
                    .describe("HTTP method"),
                path: zod.string()
                    .describe("Path, e.g., /rest/api/3/issue/{issueKey}"),
            }).describe("REST API endpoint"),
        })
            .describe("Returns details on how to use a specific REST API endpoint."),
        zod.object({
            type: zod.literal("call-endpoint"),
            endpoint: zod.object({
                method: zod.string()
                    .describe("HTTP method"),
                path: zod.string()
                    .describe("Path, e.g., /rest/api/3/issue/{issueKey}"),
            }).describe("REST API endpoint"),
            pathParameters: zod.array(zod.object({
                key: zod.string(),
                value: zod.string()
            })).optional()
                .describe("Parameters to replace placeholders in the path of the REST API endpoint"),
            queryParameters: zod.array(zod.object({
                key: zod.string(),
                value: zod.string()
            })).optional()
                .describe("Parameters to build the query part of the REST API endpoint URL"),
            body: zod.string().optional()
                .describe("JSON-encoded request body"),
        })
            .describe("Calls a specific REST API endpoint."),
    ]),
});

export const acknowledgedApiEndpointSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-endpoints"),
        })
            .describe("Returns a list of available REST API endpoints."),
        zod.object({
            type: zod.literal("get-endpoint-details"),
            endpoint: zod.object({
                method: zod.string()
                    .describe("HTTP method"),
                path: zod.string()
                    .describe("Path, e.g., /rest/api/3/issue/{issueKey}"),
            }).describe("REST API endpoint"),
        })
            .describe("Returns details on how to use a specific REST API endpoint, and provides an acknowledgment token."),
        zod.object({
            type: zod.literal("call-endpoint"),
            endpoint: zod.object({
                method: zod.string()
                    .describe("HTTP method"),
                path: zod.string()
                    .describe("Path, e.g., /rest/api/3/issue/{issueKey}"),
            }).describe("REST API endpoint"),
            acknowledgmentToken: zod.string()
                .describe("The acknowledgment token obtained by the get-endpoint-details action"),
            pathParameters: zod.array(zod.object({
                key: zod.string(),
                value: zod.string()
            })).optional()
                .describe("Parameters to replace placeholders in the path of the REST API endpoint"),
            queryParameters: zod.array(zod.object({
                key: zod.string(),
                value: zod.string()
            })).optional()
                .describe("Parameters to build the query part of the REST API endpoint URL"),
            body: zod.string().optional()
                .describe("JSON-encoded request body"),
        })
            .describe("Calls a specific REST API endpoint."),
    ]),
});
