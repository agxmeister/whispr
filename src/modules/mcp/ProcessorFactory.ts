import {Tool, Middleware, ProcessorFactory as ProcessorFactoryInterface} from "./types";
import {Processor} from "./Processor";

export class ProcessorFactory implements ProcessorFactoryInterface {
    create(tool: Tool, middlewares: Middleware[] = []): Processor {
        return new Processor(tool, middlewares);
    }
}