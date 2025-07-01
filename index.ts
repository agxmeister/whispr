import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import {z as zod} from "zod";
import axios from 'axios';

dotenv.config();

const server = new McpServer({
    name: "whispr",
    version: "1.0.0"
});

server.tool(
    "how-to-use",
    "Provides comprehensive instructions on how to manage WordPress websites.",
    async () => {
        return {
            content: [{
                type: "text",
                text: "TBD: How to manage WordPress websites.",
            }],
        };
    }
);

server.tool(
    "list-websites",
    "Returns the list of available WordPress websites.",
    async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-API-Key": "1327b28b-a1a4-23bc-8cfa-d836e36808b1",
            }

            const response = await axios.get(`${process.env.API_BASE_URL}/modules/wp-toolkit/v1/installations`, {
                headers,
                validateStatus: () => true,
            });

            return {
                content: [{
                    type: "text",
                    text: `Status Code: ${response.status}\n\nResponse Body:\n${JSON.stringify(response.data, null, 2)}`,
                }],
                metadata: {
                    statusCode: response.status,
                    headers: response.headers,
                    data: response.data
                }
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    content: [{
                        type: "text",
                        text: `Error making request: ${error.message}`,
                    }],
                    metadata: {
                        error: error.message,
                        code: error.code
                    }
                };
            }

            return {
                content: [{
                    type: "text",
                    text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
                }],
                metadata: {
                    error: error instanceof Error ? error.message : String(error)
                }
            };
        }
    }
);

const transport = new StdioServerTransport();

(async () => {
    await server.connect(transport);
})();
