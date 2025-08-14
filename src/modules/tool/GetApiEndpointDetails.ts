import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {getApiEndpointDetailsSchema} from "./schemas";
import {getNames, getDescriptions, getOpenApiEndpoints} from "./utils";

export class GetApiEndpointDetails extends EdgeTool {
    getName(): string {
        return getNames(this.edge).getApiEndpointDetails;
    }

    getDescription(): string {
        return getDescriptions(this.edge).getApiEndpointDetails;
    }

    getSchema() {
        return getApiEndpointDetailsSchema.shape;
    }

    getHandler() {
        return async ({endpoint}: zod.infer<typeof getApiEndpointDetailsSchema>) => {
            const target = (await getOpenApiEndpoints(this.edge.api.specification))
                .filter(({method, path}) =>
                    path === endpoint.path && method === endpoint.method
                ).shift();

            if (!target) {
                return {
                    content: [{
                        type: "text",
                        text: `Endpoint ${endpoint.method} ${endpoint.path} does not exists.`,
                    }],
                    isError: true,
                };
            }

            return {
                content: [{
                    type: "text",
                    text: `${target.method} ${target.path} - ${target.details.description}
            ${target.details.parameters
                        ? `\n\nParameters:\n\n${JSON.stringify(target.details.parameters, null, 2)}`
                        : "\n\nNo parameters expected."}
            ${target.details.requestBody
                        ? `\n\nRequest body:\n\n${JSON.stringify(target.details.requestBody, null, 2)}`
                        : "\n\nRequest body must be empty."}`,
                }]
            }
        };
    }
}
