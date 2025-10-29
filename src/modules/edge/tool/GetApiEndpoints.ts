import {EdgeTool} from "./EdgeTool";
import {getApiEndpointsToolSchema} from "./schemas";
import {Result} from "@/modules/tool";

export class GetApiEndpoints extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoints`;
    readonly description = `Returns a list of ${this.edge.name} REST API endpoints. Use it if you want to ${this.edge.tasks.join(", ")}. Before using an endpoint, get its details.`;
    readonly schema = getApiEndpointsToolSchema.shape;
    readonly handler = async(): Promise<Result<any>> =>
        await this.rest.listEndpoints();
}
