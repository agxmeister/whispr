import axios from "axios";
import * as https from "https";
import * as yaml from "js-yaml";
import {dereferenceSync} from "dereference-json-schema";
import {OpenApiEndpoint} from "./types";

export const getOpenApiEndpoints = async (specificationUrl: string, readonly?: boolean): Promise<OpenApiEndpoint[]> =>
    Object.entries(dereferenceSync(await getSpecification(specificationUrl)).paths)
        .reduce(
            (acc: any[], [path, pathData]: [string, any]) => [
                ...acc,
                ...Object.entries(pathData)
                    .filter(([_, methodData]: [string, any]) => !methodData.deprecated)
                    .filter(([method, _]: [string, any]) => !readonly || method.toUpperCase() === 'GET')
                    .map(([method, methodData]: [string, any]): OpenApiEndpoint => ({
                        route: {
                            method: method.toUpperCase() as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
                            path: path,
                        },
                        definition: methodData,
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
