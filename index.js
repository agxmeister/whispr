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
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const server = new mcp_js_1.McpServer({
    name: "whispr",
    version: "1.0.0"
});
server.tool("how-to-use", "Provides comprehensive instructions on how to manage WordPress websites.", () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        content: [{
                type: "text",
                text: "TBD: How to manage WordPress websites.",
            }],
    };
}));
server.tool("list-websites", "Returns the list of available WordPress websites.", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-API-Key": "1327b28b-a1a4-23bc-8cfa-d836e36808b1",
        };
        const response = yield axios_1.default.get(`${process.env.API_BASE_URL}/modules/wp-toolkit/v1/installations`, {
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
