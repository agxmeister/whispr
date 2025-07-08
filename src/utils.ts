import fs from "fs";
import path from "path";
import {OpenApiEndpoint, Service} from "./types";
import {dereferenceSync} from "dereference-json-schema";
import axios from "axios";

export const getServices = async () => JSON.parse(Object.entries(process.env).reduce(
    (string, [key, value]) => string.split(`{{${key}}}`).join(value),
    fs.readFileSync(path.join(__dirname, '../services.json'), 'utf8'),
)) as Service[];

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
