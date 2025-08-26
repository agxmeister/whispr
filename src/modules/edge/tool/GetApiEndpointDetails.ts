import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {getApiEndpointDetailsSchema} from "./schemas";
import {getOpenApiEndpoints} from "./utils";

export class GetApiEndpointDetails extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-get-api-endpoint-details`;
    readonly description = `Returns details on how to use a specific ${this.edge.name} REST API endpoint.`;
    readonly schema = getApiEndpointDetailsSchema.shape;
    readonly handler = async ({endpoint}: zod.infer<typeof getApiEndpointDetailsSchema>) => {
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
