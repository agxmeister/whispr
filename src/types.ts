export type Service = {
    name: string,
    url: {
        api: string,
        specification: string,
    },
    authorization: {
        key: string,
        value: string,
    },
    tool: {
        getApiEndpoints: string,
        getApiEndpointDetails: string,
        callApiEndpoint: string,
    },
}

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
