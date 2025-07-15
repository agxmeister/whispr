import axios, {AxiosRequestConfig} from "axios";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";
import {callApiEndpointSchema} from "./schemas";
import {Tool} from "./types";
import {getDescriptions} from "./utils";

export const CallApiEndpoint: Tool = {
    attach: (service: Service, server: McpServer) => {
        server.tool(
            `${service.name}-call-api-endpoint`,
            `${getDescriptions(service).callApiEndpoint}`,
            callApiEndpointSchema.shape,
            async ({endpoint, parameters, body}) => {
                try {
                    const config: AxiosRequestConfig = {
                        headers: {
                            "Content-Type": "application/json",
                            [service.authorization.key]: service.authorization.value,
                        },
                        method: endpoint.method,
                        url: `${service.url.api}${endpoint.path}?${parameters || ""}`,
                        data: body ? JSON.parse(body) : undefined,
                        maxRedirects: 0,
                        validateStatus: (status) => status < 500,
                    };
                    const response = await axios(config);
                    return {
                        content: [{
                            type: "text",
                            text: `HTTP code ${response.status}, response body:\n\n${JSON.stringify(response.data, null, 2)}`,
                        }],
                        isError: response.status >= 400,
                    };
                } catch (error) {
                    return {
                        content: [{
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        }],
                        isError: true,
                    };
                }
            }
        );
    }
}
