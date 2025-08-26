import {EdgeTool} from "./EdgeTool";
import {getApiEndpointsSchema} from "./schemas";
import {getApiEndpointDescription, getOpenApiEndpoints} from "./utils";

export class GetApiEndpoints extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoints`;
    readonly description = `Returns a list of ${this.edge.name} REST API endpoints. Use it if you want to ${this.edge.tasks.join(", ")}. Before using an endpoint, get its details.`;
    readonly schema = getApiEndpointsSchema.shape;
    readonly handler = async () => ({
        content: [{
            type: "text",
            text: (await getOpenApiEndpoints(this.edge.api.specification, this.profile.readonly))
                .map((openApiEndpoint) => getApiEndpointDescription(openApiEndpoint))
                .join("\n\n"),
        }]
    });
}
