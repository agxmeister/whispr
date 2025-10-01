import "@/container";
import { container } from "@/container";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { MiddlewareRegistry } from "./MiddlewareRegistry";

export class MiddlewareDiscovery {
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

                        if (module.middleware) {
                            const { name, constructor } = module.middleware;
                            const middlewareSymbol = Symbol.for(`Middleware.${name}`);

                            const registry = MiddlewareRegistry.getInstance();
                            registry.register(name, middlewareSymbol);

                            container.bind(middlewareSymbol).to(constructor);
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