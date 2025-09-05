import {z as zod} from "zod";

export const apiEndpointRouteSchema = zod.object({
    method: zod.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .describe("HTTP method"),
    path: zod.string()
        .describe("Path, e.g., /v1/installations"),
}).describe("REST API endpoint");

export const getApiEndpointsToolSchema = zod.object({
});

export const getApiEndpointDetailsToolSchema = zod.object({
    endpoint: apiEndpointRouteSchema,
});

export const callApiEndpointToolSchema = zod.object({
    endpoint: apiEndpointRouteSchema,
    parameters: zod.string().optional()
        .describe("URL-encoded request parameters, if applicable"),
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
            endpoint: apiEndpointRouteSchema,
        })
            .describe("Returns details on how to use a specific REST API endpoint."),
        zod.object({
            type: zod.literal("call-endpoint"),
            endpoint: apiEndpointRouteSchema,
            parameters: zod.string().optional()
                .describe("URL-encoded request parameters, if applicable"),
            body: zod.string().optional()
                .describe("JSON-encoded request body, if applicable"),
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
                method: zod.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
                    .describe("HTTP method"),
                path: zod.string()
                    .describe("Path, e.g., /v1/installations"),
            }).describe("REST API endpoint"),
        })
            .describe("Returns details on how to use a specific REST API endpoint and provides an acknowledgment token."),
        zod.object({
            type: zod.literal("call-endpoint"),
            endpoint: zod.object({
                method: zod.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
                    .describe("HTTP method"),
                path: zod.string()
                    .describe("Path, e.g., /v1/installations"),
            }).describe("REST API endpoint"),
            acknowledgmentToken: zod.string()
                .describe("The acknowledgment token obtained from get-endpoint-details action"),
            parameters: zod.string().optional()
                .describe("URL-encoded request parameters, if applicable"),
            body: zod.string().optional()
                .describe("JSON-encoded request body, if applicable"),
        })
            .describe("Calls a specific REST API endpoint. Requires acknowledgment token from get-endpoint-details."),
    ]),
});
