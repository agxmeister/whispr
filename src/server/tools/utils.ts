import axios from "axios";
import {dereferenceSync} from "dereference-json-schema";
import {OpenApiEndpoint} from "./types";

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
