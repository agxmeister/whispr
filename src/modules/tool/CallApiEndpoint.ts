import {z as zod} from "zod";
import axios, {AxiosRequestConfig} from "axios";
import https from "https";
import {EdgeTool} from "./EdgeTool";
import {callApiEndpointSchema} from "./schemas";
import {getNames, getDescriptions} from "./utils";

export class CallApiEndpoint extends EdgeTool {
    getName(): string {
        return getNames(this.edge).callApiEndpoint;
    }

    getDescription(): string {
        return getDescriptions(this.edge).callApiEndpoint;
    }

    getSchema() {
        return callApiEndpointSchema.shape;
    }

    getHandler() {
        return async ({endpoint, parameters, body}: zod.infer<typeof callApiEndpointSchema>) => {
            try {
                const config: AxiosRequestConfig = {
                    headers: {
                        "Content-Type": "application/json",
                        ...this.edge.api.request.headers,
                    },
                    method: endpoint.method,
                    url: `${this.edge.api.request.url}${endpoint.path}?${parameters || ""}`,
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
        };
    }
}
