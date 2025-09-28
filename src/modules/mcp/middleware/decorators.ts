import { MiddlewareRegistry } from "./MiddlewareRegistry";
import { MiddlewareConstructor } from "./types";

export function RegisterMiddleware(name: string) {
    return function <T extends MiddlewareConstructor>(constructor: T) {
        const registry = MiddlewareRegistry.getInstance();
        registry.register(name, constructor);
        return constructor;
    };
}