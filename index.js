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
const endpointSchema = zod_1.z.object({
    method: zod_1.z.enum(["GET", "POST", "PUT", "PATCH"])
        .describe("HTTP method"),
    path: zod_1.z.string()
        .describe("Path, e.g., /v1/installations"),
}).describe("REST API endpoint");
const wpToolkitApiEndpointDetailsSchema = zod_1.z.object({
    endpoint: endpointSchema,
});
const wpToolkitApiRequestSchema = zod_1.z.object({
    endpoint: endpointSchema,
    data: zod_1.z.string()
        .describe("JSON-encoded parameters, if needed"),
});
const getEndpoints = () => __awaiter(void 0, void 0, void 0, function* () {
    return Object.entries((0, dereference_json_schema_1.dereferenceSync)((yield axios_1.default.get(`${process.env.API_BASE_URL}/modules/wp-toolkit/v1/specification/public`))
        .data).paths).reduce((acc, [path, pathData]) => [
        ...acc,
        ...Object.entries(pathData)
            .map(([method, methodData]) => ({
            method: method.toUpperCase(),
            path: path,
            details: methodData,
        }))
    ], []);
});
server.tool("wp-toolkit-api-endpoints", "Provides a list of REST API endpoints for managing WordPress websites. Before using an endpoint, check its details.", () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        content: [{
                type: "text",
                text: (yield getEndpoints())
                    .map(({ method, path, details }) => `${method} ${path} - ${details.description}`)
                    .join("\n\n"),
            }]
    });
}));
server.tool("wp-toolkit-api-endpoint-details", "Provides details on a specific REST API endpoint to manage WordPress websites.", wpToolkitApiEndpointDetailsSchema.shape, (_a) => __awaiter(void 0, [_a], void 0, function* ({ endpoint }) {
    const target = (yield getEndpoints())
        .filter(({ method, path }) => path === endpoint.path && method === endpoint.method).shift();
    if (!target) {
        return {
            content: [{
                    type: "text",
                    text: `Endpoint ${endpoint.method} ${endpoint.path} does not exists.`,
                }],
            isError: true,
        };
    }
    const text = `${target.method} ${target.path} - ${target.details.description}`
        + (target.details.requestBody
            ? (target.details.requestBody.required ? `\n\nRequest body required, ` : `\n\nRequest body optional, `)
                + `schema: \n\n${JSON.stringify(target.details.requestBody.content['application/json'].schema, null, 2)}`
            : `\n\nRequest body should be empty.`);
    return {
        content: [{
                type: "text",
                text: text,
            }]
    };
}));
server.tool("wp-toolkit-api", "Request a specific REST API endpoint to manage WordPress websites. Before using an endpoint, check its details.", wpToolkitApiRequestSchema.shape, (_a) => __awaiter(void 0, [_a], void 0, function* ({ endpoint, data }) {
    try {
        const response = yield (0, axios_1.default)({
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY,
            },
            method: endpoint.method,
            url: `${process.env.API_BASE_URL}/modules/wp-toolkit${endpoint.path}`,
            data: JSON.parse(data || "{}"),
        });
        return {
            content: [{
                    type: "text",
                    text: `HTTP code ${response.status}, response body: \n\n${JSON.stringify(response.data, null, 2)}`,
                }],
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                }],
            isError: true,
        };
    }
}));
const transport = new stdio_js_1.StdioServerTransport();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.connect(transport);
}))();
