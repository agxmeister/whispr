import {z as zod} from "zod";

export const apiEndpointsSchema = zod.object({
    method: zod.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .describe("HTTP method"),
    path: zod.string()
        .describe("Path, e.g., /v1/installations"),
}).describe("REST API endpoint");

export const getApiEndpointsSchema = zod.object({
});

export const getApiEndpointDetailsSchema = zod.object({
    endpoint: apiEndpointsSchema,
});

export const callApiEndpointSchema = zod.object({
    endpoint: apiEndpointsSchema,
    parameters: zod.string().optional()
        .describe("URL-encoded request parameters, if applicable"),
    body: zod.string().optional()
        .describe("JSON-encoded request body, if applicable"),
});

export const apiEndpointSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-endpoints"),
        })
            .describe("Returns a list of available REST API endpoints."),
        zod.object({
            type: zod.literal("get-endpoint-details"),
            endpoint: apiEndpointsSchema,
        })
            .describe("Returns details on how to use a specific REST API endpoint."),
        zod.object({
            type: zod.literal("call-endpoint"),
            endpoint: apiEndpointsSchema,
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
            endpoint: apiEndpointsSchema,
        })
            .describe("Returns details on how to use a specific REST API endpoint and provides an acknowledgment token."),
        zod.object({
            type: zod.literal("call-endpoint"),
            endpoint: apiEndpointsSchema,
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
