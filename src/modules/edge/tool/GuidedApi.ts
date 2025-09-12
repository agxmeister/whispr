import {z as zod} from "zod";
import {EdgeTool} from "./EdgeTool";
import {acknowledgedApiEndpointSchema} from "./schemas";
import {Rest} from "./Rest";
import {Edge} from "@/modules/edge";
import {AcknowledgmentTokenService} from "./token/service";

export class GuidedApi extends EdgeTool {
    readonly name = `${this.edge.name.toLowerCase()}-guided-api`;
    readonly description = `If you want to ${this.edge.tasks.join(", ")}, use this tool to interact with the ${this.edge.name} REST API. This tool requires getting endpoint details first to obtain an acknowledgment token before calling any endpoint. A typical workflow is to list available ${this.edge.name} endpoints, get endpoint details (which provides a token), and then call endpoints using the token. You MUST call get-endpoint-details before calling any endpoint to ensure you understand how to use it properly!`;
    readonly schema = acknowledgedApiEndpointSchema.shape;

    constructor(
        edge: Edge, 
        rest: Rest,
        private readonly tokenService: AcknowledgmentTokenService
    ) {
        super(edge, rest);
    }

    readonly handler = async (params: zod.infer<typeof acknowledgedApiEndpointSchema>) => {
        const action = params.action;

        if (action.type === "list-endpoints") {
            return await this.rest.listEndpoints();
        }

        if (action.type === "get-endpoint-details") {
            const acknowledgmentToken = this.tokenService.setAcknowledgmentToken(this.edge, action.endpoint);
            const details = await this.rest.getEndpointDetails(action.endpoint);
            
            details.content.push({
                type: "text",
                text: `Acknowledgment token: ${acknowledgmentToken.code}`,
            });
            
            return details;
        }

        if (action.type === "call-endpoint") {
            const token = this.tokenService.getAcknowledgmentToken(this.edge, action.endpoint);
            if (!token || action.acknowledgmentToken !== token.code) {
                throw new Error("Invalid acknowledgment token. You must call get-endpoint-details first to obtain a valid token for this endpoint.");
            }
            return await this.rest.callEndpoint(action.endpoint, action.pathParameters, action.queryParameters, action.body);
        }
    };
}