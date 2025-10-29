import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {guidedApiToolSchema} from "./schemas";
import {Rest} from "@/modules/rest";
import {Edge} from "@/modules/edge";
import {TokenService} from "@/modules/token";
import {TokenPayload} from "./types";
import {Result, success, failure} from "@/modules/tool";

export class GuidedApi extends EdgeTool {
    constructor(edge: Edge, rest: Rest, private readonly tokenService: TokenService<TokenPayload>) {
        super(edge, rest);
    }

    readonly name = `${this.edge.name.toLowerCase()}-guided-api`;
    readonly description = `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. A typical workflow involves getting a list of ${this.edge.name} endpoints, getting details on how to use an appropriate endpoint, and finally, calling an endpoint.`;
    readonly schema = guidedApiToolSchema.shape;

    readonly handler = async ({action}: zod.infer<typeof guidedApiToolSchema>): Promise<Result<any>> => {
        switch (action.type) {
            case 'list-endpoints':
                return await this.rest.listEndpoints();
            case 'get-endpoint-details':
                const detailsResult = await this.rest.getEndpointDetails(action.endpoint);
                if (!detailsResult.success) {
                    return detailsResult;
                }
                return success({
                    ...detailsResult.value,
                    acknowledgmentToken: (this.tokenService.getToken(
                        this.edge.name.toLowerCase(),
                        p => p.method === action.endpoint.method.toLowerCase() && p.path === action.endpoint.path
                    ) ?? this.tokenService.setToken(
                        this.edge.name.toLowerCase(),
                        {
                            method: action.endpoint.method.toLowerCase(),
                            path: action.endpoint.path,
                        }
                    )).code
                });
            case 'call-endpoint':
                const token = this.tokenService.getToken(
                    this.edge.name.toLowerCase(),
                    p => p.method === action.endpoint.method.toLowerCase() && p.path === action.endpoint.path
                );
                if (!token || action.acknowledgmentToken !== token.code) {
                    return failure({
                        error: "Invalid acknowledgment token. You must obtain an acknowledgment token for this endpoint using the get-endpoint-details action."
                    });
                }
                return await this.rest.callEndpoint(action.endpoint, action.pathParameters, action.queryParameters, action.body);
        }
    }
}