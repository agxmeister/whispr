import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {Service} from "../../types";
import {callApiEndpointSchema} from "./schemas";
import {Tool} from "./types";
import {getNames, getDescriptions} from "./utils";

export const CallApiEndpoint: Tool = {
    attach: (service: Service, server: McpServer) => {
        server.tool(
            `${getNames(service).callApiEndpoint}`,
            `${getDescriptions(service).callApiEndpoint}`,
            callApiEndpointSchema.shape,
            async ({endpoint, parameters, body}) => {
                try {
                    const config: AxiosRequestConfig = {
                        headers: {
                            "Content-Type": "application/json",
                            ...service.api.request.headers,
                        },
                        method: endpoint.method,
                        url: `${service.api.request.url}${endpoint.path}?${parameters || ""}`,
                        data: body ? JSON.parse(body) : undefined,
                        maxRedirects: 0,
                        validateStatus: (status) => status < 500,
                        httpsAgent: new https.Agent({
                            rejectUnauthorized: false
                        }),
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
