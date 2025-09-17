import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {apiToolSchema} from "./schemas";
import {formatted} from "../../mcp/decorators";

export class RawApi extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-raw-api`;
    readonly description = `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. A typical workflow involves getting a list of ${this.edge.name} endpoints, getting details on how to use an appropriate endpoint, and finally, calling an endpoint.`;
    readonly schema = apiToolSchema.shape;

    @formatted
    async handler({action}: zod.infer<typeof apiToolSchema>) {
        switch (action.type) {
            case 'list-endpoints':
                return await this.rest.listEndpoints();
            case 'get-endpoint-details':
                return await this.rest.getEndpointDetails(action.endpoint);
            case 'call-endpoint':
                return await this.rest.callEndpoint(
                    action.endpoint,
                    action.pathParameters,
                    action.queryParameters,
                    action.body
                );
        }
    }
}