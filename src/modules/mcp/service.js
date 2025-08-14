"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpServerService = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
class McpServerService {
    createServer(services, toolDefinitions) {
        const server = new mcp_js_1.McpServer({
            name: "whispr",
            version: "1.0.0",
        });
        for (const service of services) {
            for (const toolDef of toolDefinitions) {
                const name = toolDef.getName(service);
                const description = toolDef.getDescription(service);
                const schema = toolDef.getSchema(service);
                const handler = toolDef.getHandler(service);
                if (schema === undefined) {
                    server.tool(name, description, handler);
                }
                else {
                    server.tool(name, description, schema, handler);
                }
            }
        }
        return server;
    }
}
exports.McpServerService = McpServerService;
