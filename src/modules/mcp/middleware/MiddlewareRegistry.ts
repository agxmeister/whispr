export class MiddlewareRegistry {
    private static instance: MiddlewareRegistry;
    private middlewares = new Map<string, symbol>();

    private constructor() {
    }

    static getInstance(): MiddlewareRegistry {
        if (!MiddlewareRegistry.instance) {
            MiddlewareRegistry.instance = new MiddlewareRegistry();
        }
        return MiddlewareRegistry.instance;
    }

    register(name: string, symbol: symbol): void {
        this.middlewares.set(name, symbol);
    }

    get(name: string): symbol | undefined {
        return this.middlewares.get(name);
    }

    has(name: string): boolean {
        return this.middlewares.has(name);
    }
}