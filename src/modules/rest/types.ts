export type Specification = {
    url?: string,
    path?: string,
}

export type OpenApiEndpoint = {
    route: OpenApiEndpointRoute,
    definition: OpenApiEndpointDefinition,
}

export type OpenApiEndpointRoute = {
    method: string,
    path: string,
};

export type OpenApiEndpointDefinition = {
    summary: string,
    description: string,
    parameters?: [
        Record<string, any>
    ],
    requestBody?: Record<string, any>
}

export type Parameter = {
    key: string;
    value: string;
};
