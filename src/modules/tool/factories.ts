import {Edge} from "../edge";
import {Tool, EdgeToolFactory} from "./types";
import {CallApiEndpoint} from "./CallApiEndpoint";
import {GetApiEndpoints} from "./GetApiEndpoints";
import {GetApiEndpointDetails} from "./GetApiEndpointDetails";

export class CallApiEndpointFactory implements EdgeToolFactory {
    create(edge: Edge): Tool {
        return new CallApiEndpoint(edge);
    }
}

export class GetApiEndpointsFactory implements EdgeToolFactory {
    create(edge: Edge): Tool {
        return new GetApiEndpoints(edge);
    }
}

export class GetApiEndpointDetailsFactory implements EdgeToolFactory {
    create(edge: Edge): Tool {
        return new GetApiEndpointDetails(edge);
    }
}