import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Formatter} from "@/modules/tool/formatter";
import {CallEndpointResult} from "./types";

export class EdgeToolFormatter implements Formatter {
    formatSuccess(result: any): CallToolResult {
        const isCallEndpointResult = this.isCallEndpointResult(result);
        const isError = isCallEndpointResult && result.status >= 400;

        return {
            content: [{
                type: "text",
                text: JSON.stringify(result, null, 2),
            }],
            ...(isError && { isError: true })
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

    private isCallEndpointResult(result: any): result is CallEndpointResult {
        return typeof result === 'object'
            && result !== null
            && 'status' in result
            && typeof result.status === 'number';
    }
}
