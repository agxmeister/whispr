import fs from "fs";
import path from "path";
import {Service} from "./types";

export const getServices = async () => JSON.parse(Object.entries(process.env).reduce(
    (string, [key, value]) => string.split(`{{${key}}}`).join(value),
    fs.readFileSync(path.join(__dirname, '../services.json'), 'utf8'),
)) as Service[];
