import {EdgeToolMiddlewaresFactory as EdgeToolMiddlewaresFactoryInterface, Middleware} from "./types";
import {Tool} from "../types";
import {Edge} from "@/modules/edge";
import {MiddlewareRegistry} from "./MiddlewareRegistry";
import {LoggerService} from "@/modules/logger";

export class EdgeToolMiddlewaresFactory implements EdgeToolMiddlewaresFactoryInterface {
    constructor(private readonly loggerService: LoggerService) {}

    create(edge: Edge, tool: Tool): Middleware[] {
        const registry = MiddlewareRegistry.getInstance();
        const LoggingMiddlewareClass = registry.get("logging");

        if (!LoggingMiddlewareClass) {
            return [];
        }

        const loggingMiddleware = new LoggingMiddlewareClass(this.loggerService);
        return [loggingMiddleware];
    }
}