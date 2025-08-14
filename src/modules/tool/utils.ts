import axios from "axios";
import * as https from "https";
import * as yaml from "js-yaml";
import {dereferenceSync} from "dereference-json-schema";
import {OpenApiEndpoint} from "./types";
import {Edge} from "../edge";

export const getOpenApiEndpoints = async (specificationUrl: string): Promise<OpenApiEndpoint[]> =>
    Object.entries(dereferenceSync(await getSpecification(specificationUrl)).paths)
        .reduce(
            (acc: any[], [path, pathData]: [string, any]) => [
                ...acc,
                ...Object.entries(pathData)
                    .filter(([_, methodData]: [string, any]) => !methodData.deprecated)
                    .map(([method, methodData]: [string, any]) => ({
                        method: method.toUpperCase(),
                        path: path,
                        details: methodData,
                    }))
            ],
            []
        );

const getSpecification = async (specificationUrl: string): Promise<any> => {
    const data = (await axios.get(specificationUrl, {
        responseType: 'text',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
    })).data;

    try {
        return JSON.parse(data);
    } catch (error) {
        try {
            return yaml.load(data);
        } catch (error) {
        }
    }
};

export const getApiEndpointDescription = ({method, path, details}: OpenApiEndpoint): string => {
    const endpoint = `${method} ${path}`;
    const explanation = details.summary ?? details.description;
    return explanation ? `${endpoint} - ${explanation}` : endpoint;
};

export const getNames = (edge: Edge) => ({
    getApiEndpoints: `${edge.name.toLowerCase()}-get-api-endpoints`,
    getApiEndpointDetails: `${edge.name.toLowerCase()}-get-api-endpoint-details`,
    callApiEndpoint: `${edge.name.toLowerCase()}-call-api-endpoint`,
});

export const getDescriptions = (edge: Edge) => ({
    getApiEndpoints: edge.refine?.description?.glance ?? `Returns a list of ${edge.name} REST API endpoints. Use it if you want to ${edge.tasks.join(", ")}. Before using an endpoint, get its details.`,
    getApiEndpointDetails: edge.refine?.description?.gauge ?? `Returns details on how to use a specific ${edge.name} REST API endpoint.`,
    callApiEndpoint: edge.refine?.description?.go ?? `Calls a specific ${edge.name} REST API endpoint.`,
});
