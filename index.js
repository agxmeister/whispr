"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const dereference_json_schema_1 = require("dereference-json-schema");
dotenv_1.default.config();
const server = new mcp_js_1.McpServer({
    name: "whispr",
    version: "1.0.0"
});
server.tool("wp-toolkit-api-how-to", "Provides the comprehensive instruction on how to manage WordPress websites using WP Toolkit REST API.", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${process.env.API_BASE_URL}/modules/wp-toolkit/v1/specification/public`);
    const schema = (0, dereference_json_schema_1.dereferenceSync)(response.data);
    const calls = Object.entries(schema.paths)
        .filter(([path]) => [
        "/v1/installations",
        "/v1/installations/{installationId}",
        "/v1/installations/{installationId}/features/debug/status",
        "/v1/installations/{installationId}/features/debug/settings",
        "/v1/installations/{installationId}/features/maintenance/status",
        "/v1/installations/{installationId}/features/maintenance/settings",
        "/v1/installations/{installationId}/backups/meta",
        "/v1/features/backups/creator",
        "/v1/features/backups/restorer",
    ].includes(path))
        .reduce((acc, [path, pathData]) => [...acc, ...Object.entries(pathData).map(([method, methodData]) => [path, method, methodData])], [])
        .map(([path, method, methodData]) => `${method.toUpperCase()} ${path} - ${methodData.description}.\nRequest body schema: ${methodData.requestBody ? JSON.stringify(methodData.requestBody.content['application/json'].schema, null, 2) : "none"}`);
    return {
        content: [{
                type: "text",
                text: calls.join("\n\n"),
            }]
    };
}));
const wpToolkitApiSchema = zod_1.z.object({
    method: zod_1.z.enum(["GET", "POST", "PUT", "PATCH"]).describe("HTTP method to use for the API call, e.g., GET, PUT."),
    endpoint: zod_1.z.string().describe("API endpoint to call, e.g., /v1/installations"),
    data: zod_1.z.string().describe("JSON-encoded parameters for the request body, if required."),
});
server.tool("wp-toolkit-api", "Performs the given API call to WP Toolkit. Important: read the how-to before use.", wpToolkitApiSchema.shape, (_a) => __awaiter(void 0, [_a], void 0, function* ({ method, endpoint, data }) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-API-Key": process.env.API_KEY,
        };
        const params = JSON.parse(data || "{}");
        let response;
        if (method === "GET") {
            response = yield axios_1.default.get(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, {
                headers,
                validateStatus: () => true,
            });
        }
        else if (method === "POST") {
            response = yield axios_1.default.post(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, params, {
                headers,
                validateStatus: () => true,
            });
        }
        else if (method === "PUT") {
            response = yield axios_1.default.put(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, params, {
                headers,
                validateStatus: () => true,
            });
        }
        else if (method === "PATCH") {
            response = yield axios_1.default.patch(`${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint}`, params, {
                headers,
                validateStatus: () => true,
            });
        }
        if (!response || !response.data) {
            return {
                content: [{
                        type: "text",
                        text: `No response data received from the API.`,
                    }],
                metadata: {
                    statusCode: response ? response.status : null,
                    headers: response ? response.headers : null,
                    data: null
                }
            };
        }
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
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
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
}));
const transport = new stdio_js_1.StdioServerTransport();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.connect(transport);
}))();
