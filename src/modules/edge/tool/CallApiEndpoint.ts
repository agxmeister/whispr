import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {callApiEndpointToolSchema} from "./schemas";
import {Result, success, failure} from "@/modules/tool";

export class CallApiEndpoint extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-call-api-endpoint`;
    readonly description = `Calls a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = callApiEndpointToolSchema.shape;
    readonly handler = async({endpoint, pathParameters, queryParameters, body}: zod.infer<typeof callApiEndpointToolSchema>): Promise<Result<any>> => {
        try {
            const response = await this.rest.callEndpoint(endpoint, pathParameters, queryParameters, body);

            if (response.status >= 400) {
                return failure(response);
            }

            return success(response);
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };
}
