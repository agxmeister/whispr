import { container } from "@/container";
import { AssistantRegistry } from "./AssistantRegistry";
import { AssistantConstructor } from "./types";

export function RegisterAssistant(name: string) {
    return function <T extends AssistantConstructor>(constructor: T) {
        const assistantSymbol = Symbol.for(`Assistant.${name}`);

        const registry = AssistantRegistry.getInstance();
        registry.register(name, assistantSymbol);

        container.bind(assistantSymbol).toConstantValue(constructor);

        return constructor;
    };
}
