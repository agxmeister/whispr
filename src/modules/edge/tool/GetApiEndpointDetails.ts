import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {getApiEndpointDetailsToolSchema} from "./schemas";
import {Result, success, failure} from "@/modules/tool";

export class GetApiEndpointDetails extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoint-details`;
    readonly description = `Returns details on how to use a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = getApiEndpointDetailsToolSchema.shape;
    readonly handler = async ({endpoint}: zod.infer<typeof getApiEndpointDetailsToolSchema>): Promise<Result<any>> => {
        try {
            const details = await this.rest.getEndpointDetails(endpoint);
            return success(details);
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };
}
