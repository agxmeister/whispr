export interface Tool {
    getName(): string;
    getDescription(): string;
    getSchema(): any;
    getHandler(): (...args: any[]) => Promise<any>;
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
