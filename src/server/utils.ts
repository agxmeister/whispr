import {Service} from "../types";
import {McpServerBuilder} from "./types";

export const getServer = async (builder: McpServerBuilder, services: Service[]) => {
    for (const service of services) {
        builder.addService(service);
    }
    return builder.build();
}
