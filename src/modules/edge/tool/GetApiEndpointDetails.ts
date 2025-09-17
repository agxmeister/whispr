import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {getApiEndpointDetailsToolSchema} from "./schemas";
import {formatted} from "../../mcp/decorators";

export class GetApiEndpointDetails extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoint-details`;
    readonly description = `Returns details on how to use a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = getApiEndpointDetailsToolSchema.shape;

    @formatted
    async handler({endpoint}: zod.infer<typeof getApiEndpointDetailsToolSchema>) {
        return await this.rest.getEndpointDetails(endpoint);
    }
}
