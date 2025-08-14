import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {getNames, getDescriptions, getOpenApiEndpoints, getApiEndpointDescription} from "./utils";

export class GetApiEndpoints extends EdgeTool {
    getName(): string {
        return getNames(this.edge).getApiEndpoints;
    }

    getDescription(): string {
        return getDescriptions(this.edge).getApiEndpoints;
    }

    getSchema() {
        return zod.object({}).shape;
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
