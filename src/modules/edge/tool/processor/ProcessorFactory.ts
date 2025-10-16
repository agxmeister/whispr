import {injectable, inject} from "inversify";
import {Tool} from "@/modules/mcp/types";
import {ProcessorFactory as ProcessorFactoryInterface} from "./types";
import {Middleware} from "../middleware";
import {Processor} from "./Processor";
import {ProfileFactory} from "@/modules/profile";
import {dependencies} from "@/dependencies";

@injectable()
export class ProcessorFactory implements ProcessorFactoryInterface {
    constructor(@inject(dependencies.ProfileFactory) private readonly profileFactory: ProfileFactory) {}

    async create(tool: Tool, middlewares?: Middleware[]): Promise<Processor> {
        const profile = await this.profileFactory.create();
        return new Processor(tool, middlewares, profile);
    }
}