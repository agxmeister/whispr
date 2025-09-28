import { MiddlewareConstructor } from "./types";

export class MiddlewareRegistry {
    private static instance: MiddlewareRegistry;
    private middlewares = new Map<string, MiddlewareConstructor>();

    private constructor() {}

    static getInstance(): MiddlewareRegistry {
        if (!MiddlewareRegistry.instance) {
            MiddlewareRegistry.instance = new MiddlewareRegistry();
        }
        return MiddlewareRegistry.instance;
    }

    register(name: string, middlewareClass: MiddlewareConstructor): void {
        this.middlewares.set(name, middlewareClass);
    }

    get(name: string): MiddlewareConstructor | undefined {
        return this.middlewares.get(name);
    }

    getAll(): Map<string, MiddlewareConstructor> {
        return new Map(this.middlewares);
    }

    has(name: string): boolean {
        return this.middlewares.has(name);
    }

    getRegisteredNames(): string[] {
        return Array.from(this.middlewares.keys());
    }
}