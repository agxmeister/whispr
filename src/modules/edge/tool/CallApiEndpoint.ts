import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {callApiEndpointSchema} from "./schemas";

export class CallApiEndpoint extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-call-api-endpoint`;
    readonly description = `Calls a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = callApiEndpointSchema.shape;
    readonly handler = async ({endpoint, parameters, body}: zod.infer<typeof callApiEndpointSchema>) =>
        await this.restApi.callEndpoint(endpoint, parameters, body);
}
