import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";

export interface Tool {
    attach: (service: Service, server: McpServer) => void;
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
