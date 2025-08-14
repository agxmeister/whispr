import {EdgeTool} from "./EdgeTool";
import {getApiEndpointsSchema} from "./schemas";
import {getApiEndpointDescription, getOpenApiEndpoints} from "./utils";

export class GetApiEndpoints extends EdgeTool {
    getName(): string {
        return `${this.edge.name.toLowerCase()}-get-api-endpoints`;
    }

    getDescription(): string {
        return `Returns a list of ${this.edge.name} REST API endpoints. Use it if you want to ${this.edge.tasks.join(", ")}. Before using an endpoint, get its details.`;
    }

    getSchema() {
        return getApiEndpointsSchema.shape;
    }

    getHandler() {
        return async () => ({
            content: [{
                type: "text",
                text: (await getOpenApiEndpoints(this.edge.api.specification))
                    .map((openApiEndpoint) => getApiEndpointDescription(openApiEndpoint))
                    .join("\n\n"),
            }]
        });
    }
}
