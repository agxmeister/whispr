import {Edge} from "../edge";
import {Profile} from "../config";

export interface Tool {
    getName(): string;
    getDescription(): string;
    getSchema(): any;
    getHandler(): (...args: any[]) => Promise<any>;
}

export interface EdgeToolFactory {
    create(edge: Edge, profile: Profile): Tool;
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
