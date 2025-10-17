import fs from "fs";
import { Config } from "./types";

export class ConfigRepository {
    constructor(readonly path: string) {
    }

    async getConfig(): Promise<Config> {
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