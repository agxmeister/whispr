import {ServerBuilder} from "./ServerBuilder";
import {CallApiEndpoint, GetApiEndpointDetails, GetApiEndpoints} from "./tools";
import {Service} from "../types";

export const getServer = async (services: Service[]) => {
    const builder = new ServerBuilder([
        GetApiEndpoints,
        GetApiEndpointDetails,
        CallApiEndpoint,
    ]);
    for (const service of services) {
        builder.addService(service);
    }
    return builder.build();
}
