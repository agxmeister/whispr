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
        try {
            switch (action.type) {
                case 'list-endpoints':
                    const endpoints = await this.rest.listEndpoints();
                    return success(endpoints);
                case 'get-endpoint-details':
                    const details = await this.rest.getEndpointDetails(action.endpoint);
                    return success({
                        ...details,
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
                    const response = await this.rest.callEndpoint(action.endpoint, action.pathParameters, action.queryParameters, action.body);

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