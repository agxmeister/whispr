import {EdgeTool} from "./EdgeTool";
import {getApiEndpointsToolSchema} from "./schemas";

export class GetApiEndpoints extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoints`;
    readonly description = `Returns a list of ${this.edge.name} REST API endpoints. Use it if you want to ${this.edge.tasks.join(", ")}. Before using an endpoint, get its details.`;
    readonly schema = getApiEndpointsToolSchema.shape;
    readonly handler = async() =>
        await this.rest.listEndpoints();
}
