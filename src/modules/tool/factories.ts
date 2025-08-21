import {Edge} from "../edge";
import {Tool} from "./types";
import {EdgeToolFactory} from "./EdgeToolFactory";
import {CallApiEndpoint} from "./CallApiEndpoint";
import {GetApiEndpoints} from "./GetApiEndpoints";
import {GetApiEndpointDetails} from "./GetApiEndpointDetails";

export class CallApiEndpointFactory extends EdgeToolFactory {
    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        return new CallApiEndpoint(edge, profile);
    }
}

export class GetApiEndpointsFactory extends EdgeToolFactory {
    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        return new GetApiEndpoints(edge, profile);
    }
}

export class GetApiEndpointDetailsFactory extends EdgeToolFactory {
    async create(edge: Edge): Promise<Tool> {
        const profile = await this.profileService.getProfile();
        return new GetApiEndpointDetails(edge, profile);
    }
}