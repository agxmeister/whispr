import {Tool, ProcessorFactory as ProcessorFactoryInterface} from "./types";
import {Middleware} from "./middleware";
import {Processor} from "./Processor";

export class ProcessorFactory implements ProcessorFactoryInterface {
    create(tool: Tool, middlewares: Middleware[] = []): Processor {
        return new Processor(tool, middlewares);
    }
}