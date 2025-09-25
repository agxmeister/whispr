import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {getApiEndpointDetailsToolSchema} from "./schemas";

export class GetApiEndpointDetails extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoint-details`;
    readonly description = `Returns details on how to use a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = getApiEndpointDetailsToolSchema.shape;
    readonly handler = async ({endpoint}: zod.infer<typeof getApiEndpointDetailsToolSchema>) =>
        await this.rest.getEndpointDetails(endpoint);
}
