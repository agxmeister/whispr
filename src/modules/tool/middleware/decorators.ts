import { container } from "@/container";
import { MiddlewareRegistry } from "./MiddlewareRegistry";
import { MiddlewareFactoryConstructor } from "./types";

export function RegisterMiddlewareFactory(name: string) {
    return function <T extends MiddlewareFactoryConstructor>(constructor: T) {
        const factorySymbol = Symbol.for(`MiddlewareFactory.${name}`);

        const registry = MiddlewareRegistry.getInstance();
        registry.register(name, factorySymbol);

        container.bind(factorySymbol).to(constructor);

        return constructor;
    };
}