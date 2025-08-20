import {Edge} from "../edge";
import {Profile} from "../config";
import {Tool, EdgeToolFactory} from "./types";
import {CallApiEndpoint} from "./CallApiEndpoint";
import {GetApiEndpoints} from "./GetApiEndpoints";
import {GetApiEndpointDetails} from "./GetApiEndpointDetails";

export class CallApiEndpointFactory implements EdgeToolFactory {
    create(edge: Edge, profile: Profile): Tool {
        return new CallApiEndpoint(edge, profile);
    }
}

export class GetApiEndpointsFactory implements EdgeToolFactory {
    create(edge: Edge, profile: Profile): Tool {
        return new GetApiEndpoints(edge, profile);
    }
}

export class GetApiEndpointDetailsFactory implements EdgeToolFactory {
    create(edge: Edge, profile: Profile): Tool {
        return new GetApiEndpointDetails(edge, profile);
    }
}