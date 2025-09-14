import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {callApiEndpointToolSchema} from "./schemas";
import {formatted} from "./decorators";

export class CallApiEndpoint extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-call-api-endpoint`;
    readonly description = `Calls a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = callApiEndpointToolSchema.shape;

    @formatted
    async handler({endpoint, pathParameters, queryParameters, body}: zod.infer<typeof callApiEndpointToolSchema>) {
        return await this.rest.callEndpoint(endpoint, pathParameters, queryParameters, body);
    }
}
