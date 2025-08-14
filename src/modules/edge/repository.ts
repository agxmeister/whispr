import fs from "fs";
import {Edge} from "./types";

export class EdgeRepository {
    constructor(readonly path: string) {
    }

    async getAll(): Promise<Edge[]> {
        const rawContent = fs.readFileSync(this.path, 'utf8');
        const interpolatedContent = this.interpolateEnvironmentVariables(rawContent);
        return JSON.parse(interpolatedContent);
    }

    private interpolateEnvironmentVariables(content: string): string {
        return Object.entries(process.env).reduce(
            (string, [key, value]) => string.split(`{{${key}}}`).join(value),
            content
        );
    }
}