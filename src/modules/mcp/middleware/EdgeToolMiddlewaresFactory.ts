import {EdgeToolMiddlewaresFactory as EdgeToolMiddlewaresFactoryInterface, Middleware} from "./types";
import {Tool} from "../types";
import {Edge} from "@/modules/edge";
import {LoggingMiddleware} from "./Logging";
import {LoggerService} from "@/modules/logger";

export class EdgeToolMiddlewaresFactory implements EdgeToolMiddlewaresFactoryInterface {
    constructor(private readonly loggerService: LoggerService) {}

    create(edge: Edge, tool: Tool): Middleware[] {
        const logger = this.loggerService.getLogger();
        const loggingMiddleware = new LoggingMiddleware(logger);
        return [loggingMiddleware];
    }
}