import fs from "fs";
import path from "path";
import {Service} from "./types";

export const getServices = async (configPath?: string): Promise<Service[]> =>
    JSON.parse(Object.entries(process.env).reduce(
        (string, [key, value]) => string.split(`{{${key}}}`).join(value),
        fs.readFileSync(configPath || path.join(__dirname, '../services.json'), 'utf8'),
    ));
