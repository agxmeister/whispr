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
    endpoint: zod.object({
        method: zod.string()
            .describe("HTTP method"),
        path: zod.string()
            .describe("Path, e.g., /rest/api/3/issue/{issueKey}"),
    }).describe("REST API endpoint"),
});

export const callApiEndpointToolSchema = zod.object({
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
});

export const apiEndpointToolSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-endpoints"),
        })
            .extend(getApiEndpointsToolSchema.shape)
            .describe("Returns a list of available REST API endpoints."),
        zod.object({
            type: zod.literal("get-endpoint-details"),
        })
            .extend(getApiEndpointDetailsToolSchema.shape)
            .describe("Returns details on how to use a specific REST API endpoint."),
        zod.object({
            type: zod.literal("call-endpoint"),
        })
            .extend(callApiEndpointToolSchema.shape)
            .describe("Calls a specific REST API endpoint."),
    ]),
});

export const acknowledgedApiEndpointSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-endpoints"),
        })
            .extend(getApiEndpointsToolSchema.shape)
            .describe("Returns a list of available REST API endpoints."),
        zod.object({
            type: zod.literal("get-endpoint-details"),
        })
            .extend(getApiEndpointDetailsToolSchema.shape)
            .describe("Returns details on how to use a specific REST API endpoint, and provides an acknowledgment token."),
        zod.object({
            type: zod.literal("call-endpoint"),
        })
            .extend(callApiEndpointToolSchema
                .extend({
                    acknowledgmentToken: zod.string()
                        .describe("The acknowledgment token obtained by the get-endpoint-details action"),
                }).shape)
            .describe("Calls a specific REST API endpoint."),
    ]),
});
