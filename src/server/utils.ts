import {ServerBuilder} from "./ServerBuilder";
import {CallApiEndpoint, GetApiEndpointDetails, GetApiEndpoints} from "./tools";
import {getServices} from "../utils";

export const getServer = async () => {
    const builder = new ServerBuilder([
        GetApiEndpoints,
        GetApiEndpointDetails,
        CallApiEndpoint,
    ]);
    for (const service of await getServices()) {
        builder.addService(service);
    }
    return builder.build();
}
