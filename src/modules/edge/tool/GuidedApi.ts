import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {guidedApiToolSchema} from "./schemas";
import {Rest} from "./rest/Rest";
import {Edge} from "@/modules/edge";
import {AcknowledgmentTokenService} from "./token/TokenService";

export class GuidedApi extends EdgeTool {
    constructor(edge: Edge, rest: Rest, private readonly tokenService: AcknowledgmentTokenService) {
        super(edge, rest);
    }

    readonly name = `${this.edge.name.toLowerCase()}-guided-api`;
    readonly description = `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. A typical workflow involves getting a list of ${this.edge.name} endpoints, getting details on how to use an appropriate endpoint, and finally, calling an endpoint.`;
    readonly schema = guidedApiToolSchema.shape;

    readonly handler = async ({action}: zod.infer<typeof guidedApiToolSchema>) => {
        switch (action.type) {
            case 'list-endpoints':
                return await this.rest.listEndpoints();
            case 'get-endpoint-details':
                const details = await this.rest.getEndpointDetails(action.endpoint);
                return {
                    ...details,
                    acknowledgmentToken: this.tokenService.setAcknowledgmentToken(this.edge, action.endpoint).code
                };
            case 'call-endpoint':
                const token = this.tokenService.getAcknowledgmentToken(this.edge, action.endpoint);
                if (!token || action.acknowledgmentToken !== token.code) {
                    throw new Error("Invalid acknowledgment token. You must obtain an acknowledgment token for this endpoint using the get-endpoint-details action.");
                }
                return await this.rest.callEndpoint(action.endpoint, action.pathParameters, action.queryParameters, action.body);
        }
    }
}