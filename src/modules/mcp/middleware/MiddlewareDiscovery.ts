import { readdirSync, statSync } from "fs";
import { join } from "path";

export class MiddlewareDiscovery {
    async discover(basePath: string): Promise<void> {
        try {
            for (const file of readdirSync(basePath)) {
                const filePath = join(basePath, file);
                const stat = statSync(filePath);
                if (stat.isFile() && file.endsWith('.js') && !file.startsWith('.')) {
                    try {
                        await import(filePath);
                    } catch (error) {
                    }
                }
            }
        } catch (error) {
        }
    }
}