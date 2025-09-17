import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {HttpError} from "../edge/tool/rest/HttpError";

export function formatted(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]): Promise<CallToolResult> {
        try {
            const payload = await originalMethod.apply(this, args);
            return formatToolResponse(payload);
        } catch (error) {
            return formatToolError(error instanceof Error ? error : new Error(String(error)));
        }
    };
}

function formatToolResponse(payload: any): CallToolResult {
    return {
        content: [{
            type: "text",
            text: JSON.stringify(payload, null, 2),
        }]
    };
}

function formatToolError(error: Error): CallToolResult {
    if (error instanceof HttpError) {
        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    status: error.status,
                    body: error.body
                }, null, 2),
            }],
            isError: true,
        };
    }

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