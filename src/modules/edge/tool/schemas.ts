import {z as zod} from "zod";

const apiEndpointsSchema = zod.object({
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
