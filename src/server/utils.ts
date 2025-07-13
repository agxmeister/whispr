import {ServerBuilder} from "./ServerBuilder";
import {CallApiEndpoint, GetApiEndpointDetails, GetApiEndpoints} from "./tools";
import {getServices} from "../utils";

export const getServer = async (configPath?: string) => {
    const builder = new ServerBuilder([
        GetApiEndpoints,
        GetApiEndpointDetails,
        CallApiEndpoint,
    ]);
    for (const service of await getServices(configPath)) {
        builder.addService(service);
    }
    return builder.build();
}
