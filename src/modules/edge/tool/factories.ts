import {Edge} from "@/modules/edge";
import {EdgeTool} from "./EdgeTool";
import {EdgeToolFactory} from "./EdgeToolFactory";
import {CallApiEndpoint} from "./CallApiEndpoint";
import {GetApiEndpoints} from "./GetApiEndpoints";
import {GetApiEndpointDetails} from "./GetApiEndpointDetails";
import {RawApi} from "./RawApi";
import {GuidedApi} from "./GuidedApi";
import {AcknowledgmentTokenService} from "./token/service";
import {RestFactory} from "./rest/RestFactory";
import {ProfileService} from "@/modules/profile";

export class CallApiEndpointFactory extends EdgeToolFactory {
    readonly name = "call-api-endpoint";

    async create(edge: Edge): Promise<EdgeTool> {
        const profile = await this.profileService.getProfile();
        const rest = this.restFactory.create(edge, profile);
        return new CallApiEndpoint(edge, rest);
    }
}

export class GetApiEndpointsFactory extends EdgeToolFactory {
    readonly name = "get-api-endpoints";

    async create(edge: Edge): Promise<EdgeTool> {
        const profile = await this.profileService.getProfile();
        const rest = this.restFactory.create(edge, profile);
        return new GetApiEndpoints(edge, rest);
    }
}

export class GetApiEndpointDetailsFactory extends EdgeToolFactory {
    readonly name = "get-api-endpoint-details";

    async create(edge: Edge): Promise<EdgeTool> {
        const profile = await this.profileService.getProfile();
        const rest = this.restFactory.create(edge, profile);
        return new GetApiEndpointDetails(edge, rest);
    }
}

export class ApiEndpointFactory extends EdgeToolFactory {
    readonly name = "raw-api";

    async create(edge: Edge): Promise<EdgeTool> {
        const profile = await this.profileService.getProfile();
        const rest = this.restFactory.create(edge, profile);
        return new RawApi(edge, rest);
    }
}

export class AcknowledgedApiEndpointFactory extends EdgeToolFactory {
    readonly name = "guided-api";

    constructor(
        restFactory: RestFactory,
        profileService: ProfileService,
        private readonly tokenService: AcknowledgmentTokenService
    ) {
        super(restFactory, profileService);
    }

    async create(edge: Edge): Promise<EdgeTool> {
        const profile = await this.profileService.getProfile();
        const rest = this.restFactory.create(edge, profile);
        return new GuidedApi(edge, rest, this.tokenService);
    }
}
