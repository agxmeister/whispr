import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {apiToolSchema} from "./schemas";
import {Result, success, failure} from "@/modules/tool";

export class RawApi extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-raw-api`;
    readonly description = `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. A typical workflow involves getting a list of ${this.edge.name} endpoints, getting details on how to use an appropriate endpoint, and finally, calling an endpoint.`;
    readonly schema = apiToolSchema.shape;

    readonly handler = async ({action}: zod.infer<typeof apiToolSchema>): Promise<Result<any>> => {
        try {
            switch (action.type) {
                case 'list-endpoints':
                    const endpoints = await this.rest.listEndpoints();
                    return success(endpoints);
                case 'get-endpoint-details':
                    const details = await this.rest.getEndpointDetails(action.endpoint);
                    return success(details);
                case 'call-endpoint':
                    const response = await this.rest.callEndpoint(
                        action.endpoint,
                        action.pathParameters,
                        action.queryParameters,
                        action.body
                    );

                    if (response.status >= 400) {
                        return failure(response);
                    }

                    return success(response);
            }
        } catch (error) {
            return failure({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
}