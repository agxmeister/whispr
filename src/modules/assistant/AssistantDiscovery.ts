import "@/container";
import { Container, inject, injectable } from "inversify";
import { readdirSync, statSync } from "fs";
import { join } from "path";

@injectable()
export class AssistantDiscovery {
    constructor(@inject(Container) private readonly container: Container) {
    }

    async discover(basePath: string): Promise<void> {
        try {
            for (const file of readdirSync(basePath)) {
                const filePath = join(basePath, file);
                const stat = statSync(filePath);

                if (file.startsWith('.')) {
                    continue;
                }

                if (stat.isFile() && file.endsWith('.js')) {
                    try {
                        await import(filePath);
                    } catch (error) {
                    }
                } else if (stat.isDirectory()) {
                    await this.discover(filePath);
                }
            }
        } catch (error) {
        }
    }
}
