import { container } from "@/container";
import { AssistantRegistry } from "./AssistantRegistry";
import { AssistantFactoryConstructor } from "./types";

export function RegisterAssistantFactory(name: string) {
    return function <T extends AssistantFactoryConstructor>(constructor: T) {
        const factorySymbol = Symbol.for(`AssistantFactory.${name}`);

        const registry = AssistantRegistry.getInstance();
        registry.register(name, factorySymbol);

        container.bind(factorySymbol).to(constructor);

        return constructor;
    };
}
