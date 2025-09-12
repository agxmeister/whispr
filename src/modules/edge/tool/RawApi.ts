import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {apiEndpointToolSchema} from "./schemas";

export class RawApi extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-raw-api`;
    readonly description = `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. A typical workflow is to list available ${this.edge.name} endpoints, get endpoint details, and then call endpoints. Do not call an endpoint before scrutinizing how to use it properly!`;
    readonly schema = apiEndpointToolSchema.shape;
    readonly handler = async (params: zod.infer<typeof apiEndpointToolSchema>) => {
        const action = params.action;

        if (action.type === "list-endpoints") {
            return await this.rest.listEndpoints();
        }

        if (action.type === "get-endpoint-details") {
            return await this.rest.getEndpointDetails(action.endpoint);
        }

        if (action.type === "call-endpoint") {
            return await this.rest.callEndpoint(action.endpoint, action.pathParameters, action.queryParameters, action.body);
        }
    };
}