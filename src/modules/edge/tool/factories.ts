import {Edge} from "@/modules/edge";
import {Tool} from "@/modules/mcp";
import {EdgeToolFactory} from "./EdgeToolFactory";
import {CallApiEndpoint} from "./CallApiEndpoint";
import {GetApiEndpoints} from "./GetApiEndpoints";
import {GetApiEndpointDetails} from "./GetApiEndpointDetails";
import {ApiEndpoint} from "./ApiEndpoint";
import {RestApi} from "./RestApi";

export class CallApiEndpointFactory extends EdgeToolFactory {
    readonly name = "call-api-endpoint";

    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        const restApi = this.restApiFactory.create(edge, profile);
        return new CallApiEndpoint(edge, restApi);
    }
}

export class GetApiEndpointsFactory extends EdgeToolFactory {
    readonly name = "get-api-endpoints";

    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        const restApi = this.restApiFactory.create(edge, profile);
        return new GetApiEndpoints(edge, restApi);
    }
}

export class GetApiEndpointDetailsFactory extends EdgeToolFactory {
    readonly name = "get-api-endpoint-details";

    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        const restApi = this.restApiFactory.create(edge, profile);
        return new GetApiEndpointDetails(edge, restApi);
    }
}

export class ApiEndpointFactory extends EdgeToolFactory {
    readonly name = "api-endpoint";

    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        const restApi = this.restApiFactory.create(edge, profile);
        return new ApiEndpoint(edge, restApi);
    }
}