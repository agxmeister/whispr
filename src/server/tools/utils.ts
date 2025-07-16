import axios from "axios";
import {dereferenceSync} from "dereference-json-schema";
import {OpenApiEndpoint} from "./types";
import {Service} from "../../types";

export const getOpenApiEndpoints = async (specificationUrl: string): Promise<OpenApiEndpoint[]> =>
    Object.entries(
        dereferenceSync(
            (await axios.get(specificationUrl))
                .data
        ).paths
    ).reduce(
        (acc: any[], [path, pathData]: [string, any]) => [
            ...acc,
            ...Object.entries(pathData)
                .map(([method, methodData]: [string, any]) => ({
                    method: method.toUpperCase(),
                    path: path,
                    details: methodData,
                }))
        ],
        []
    );

export const getNames = (service: Service) => ({
    getApiEndpoints: `${service.name.toLowerCase()}-get-api-endpoints`,
    getApiEndpointDetails: `${service.name.toLowerCase()}-get-api-endpoint-details`,
    callApiEndpoint: `${service.name.toLowerCase()}-call-api-endpoint`,
});

export const getDescriptions = (service: Service) => ({
    getApiEndpoints: `Returns a list of ${service.name} REST API endpoints. Use it if you want to ${service.tasks.join(", ")}. Before using an endpoint, get its details.`,
    getApiEndpointDetails: `Returns details on how to use a specific ${service.name} REST API endpoint.`,
    callApiEndpoint: `Calls a specific ${service.name} REST API endpoint.`,
});