import { container } from "@/container";
import { MiddlewareRegistry } from "./MiddlewareRegistry";
import { MiddlewareConstructor } from "./types";

export function RegisterMiddleware(name: string) {
    return function <T extends MiddlewareConstructor>(constructor: T) {
        const middlewareSymbol = Symbol.for(`Middleware.${name}`);

        const registry = MiddlewareRegistry.getInstance();
        registry.register(name, middlewareSymbol);

        container.bind(middlewareSymbol).to(constructor);

        return constructor;
    };
}