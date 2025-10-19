import axios from "axios";
import * as https from "https";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import {dereferenceSync} from "dereference-json-schema";
import {OpenApiEndpoint, Specification} from "./types";

export const getOpenApiEndpoints = async (specification: Specification, readonly?: boolean): Promise<OpenApiEndpoint[]> =>
    Object.entries(dereferenceSync(await getSpecification(specification)).paths)
        .reduce(
            (acc: any[], [path, pathData]: [string, any]) => [
                ...acc,
                ...Object.entries(pathData)
                    .filter(([_, methodData]: [string, any]) => !methodData.deprecated)
                    .filter(([method, _]: [string, any]) => !readonly || method.toUpperCase() === 'GET')
                    .map(([method, methodData]: [string, any]): OpenApiEndpoint => ({
                        route: {
                            method: method.toLowerCase(),
                            path: path,
                        },
                        definition: methodData,
                    }))
            ],
            []
        );

const getSpecification = async (specification: Specification): Promise<any> => {
    let data: string;

    if (specification.url) {
        data = (await axios.get(specification.url, {
            responseType: 'text',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
        })).data;
    } else if (specification.path) {
        const resolvedPath = path.resolve(__dirname, '../../../../resources/specifications', specification.path);
        data = fs.readFileSync(resolvedPath, 'utf8');
    } else {
        return;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        try {
            return yaml.load(data);
        } catch (error) {
        }
    }
};
