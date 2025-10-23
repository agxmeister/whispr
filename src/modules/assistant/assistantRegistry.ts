export class AssistantRegistry {
    private static instance: AssistantRegistry;
    private factories = new Map<string, symbol>();

    private constructor() {
    }

    static getInstance(): AssistantRegistry {
        if (!AssistantRegistry.instance) {
            AssistantRegistry.instance = new AssistantRegistry();
        }
        return AssistantRegistry.instance;
    }

    register(name: string, symbol: symbol): void {
        this.factories.set(name, symbol);
    }

    get(name: string): symbol | undefined {
        return this.factories.get(name);
    }

    has(name: string): boolean {
        return this.factories.has(name);
    }
}