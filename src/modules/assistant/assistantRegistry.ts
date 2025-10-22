export class AssistantRegistry {
    private static instance: AssistantRegistry;
    private assistants = new Map<string, symbol>();

    private constructor() {
    }

    static getInstance(): AssistantRegistry {
        if (!AssistantRegistry.instance) {
            AssistantRegistry.instance = new AssistantRegistry();
        }
        return AssistantRegistry.instance;
    }

    register(name: string, symbol: symbol): void {
        this.assistants.set(name, symbol);
    }

    get(name: string): symbol | undefined {
        return this.assistants.get(name);
    }

    has(name: string): boolean {
        return this.assistants.has(name);
    }
}