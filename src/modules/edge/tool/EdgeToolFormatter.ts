import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {Formatter} from "@/modules/tool/formatter";
import {Result} from "@/modules/tool";

export class EdgeToolFormatter implements Formatter {
    format(result: Result<any>): CallToolResult {
        return {
            content: [{
                type: "text",
                text: JSON.stringify(result.value, null, 2),
            }],
            ...(!result.success && { isError: true })
        };
    }
}
