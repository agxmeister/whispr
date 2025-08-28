import {z as zod} from "zod";
import {apiEndpointsSchema} from "@/modules/edge/tool/schemas";

export type ApiEndpoint = zod.infer<typeof apiEndpointsSchema>;

export type OpenApiEndpoint = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    details: OpenApiEndpointDetails,
}

export type OpenApiEndpointDetails = {
    summary: string,
    description: string,
    parameters?: [
        Record<string, any>
    ],
    requestBody?: Record<string, any>
}
