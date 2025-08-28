import {z as zod} from "zod";
import {apiEndpointRouteSchema} from "@/modules/edge/tool/schemas";

export type OpenApiEndpoint = {
    route: OpenApiEndpointRoute,
    definition: OpenApiEndpointDefinition,
}

export type OpenApiEndpointRoute = zod.infer<typeof apiEndpointRouteSchema>;

export type OpenApiEndpointDefinition = {
    summary: string,
    description: string,
    parameters?: [
        Record<string, any>
    ],
    requestBody?: Record<string, any>
}
