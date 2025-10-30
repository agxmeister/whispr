import {EdgeTool} from "./EdgeTool";
import {getApiEndpointsToolSchema} from "./schemas";
import {Result, success, failure} from "@/modules/tool";

export class GetApiEndpoints extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoints`;
    readonly description = `Returns a list of ${this.edge.name} REST API endpoints. Use it if you want to ${this.edge.tasks.join(", ")}. Before using an endpoint, get its details.`;
    readonly schema = getApiEndpointsToolSchema.shape;
    readonly handler = async(): Promise<Result<any>> => {
        try {
            const endpoints = await this.rest.listEndpoints();
            return success(endpoints);
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };
}
