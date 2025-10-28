import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Formatter} from "@/modules/tool/formatter";

export class EdgeToolFormatter implements Formatter {
    formatSuccess(result: any): CallToolResult {
        return {
            content: [{
                type: "text",
                text: JSON.stringify(result, null, 2),
            }]
        };
    }

    formatFailure(error: Error): CallToolResult {
        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    error: error.message
                }, null, 2),
            }],
            isError: true,
        };
    }
}
