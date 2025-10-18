import "@/container";
import { Container, inject, injectable } from "inversify";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { MiddlewareRegistry } from "./MiddlewareRegistry";
import { MiddlewareMetadata } from "./types";

@injectable()
export class MiddlewareDiscovery {
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
                        const module = await import(filePath);

                        if (module.metadata) {
                            const { name, constructor } = module.metadata as MiddlewareMetadata;
                            const middlewareSymbol = Symbol.for(`Middleware.${name}`);

                            const registry = MiddlewareRegistry.getInstance();
                            registry.register(name, middlewareSymbol);

                            this.container.bind(middlewareSymbol).to(constructor);
                        }
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