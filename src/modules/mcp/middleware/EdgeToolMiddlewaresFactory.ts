import {EdgeToolMiddlewaresFactory as EdgeToolMiddlewaresFactoryInterface, Middleware} from "./types";
import {Tool} from "../types";
import {Edge} from "@/modules/edge";
import {MiddlewareRegistry} from "./MiddlewareRegistry";
import {container} from "@/container";

export class EdgeToolMiddlewaresFactory implements EdgeToolMiddlewaresFactoryInterface {
    create(edge: Edge, tool: Tool): Middleware[] {
        const registry = MiddlewareRegistry.getInstance();
        const loggingSymbol = registry.get("logging");

        if (!loggingSymbol) {
            return [];
        }

        const loggingMiddleware = container.get<Middleware>(loggingSymbol);
        return [loggingMiddleware];
    }
}