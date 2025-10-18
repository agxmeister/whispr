import {injectable, inject} from "inversify";
import {dependencies} from "@/dependencies";
import {ProfileFactory} from "@/modules/profile";
import {Tool} from "@/modules/tool";
import {ProcessorFactory as ProcessorFactoryInterface} from "./types";
import {Middleware} from "../middleware";
import {Processor} from "./Processor";

@injectable()
export class ProcessorFactory implements ProcessorFactoryInterface {
    constructor(@inject(dependencies.ProfileFactory) private readonly profileFactory: ProfileFactory) {}

    async create(tool: Tool, middlewares?: Middleware[]): Promise<Processor> {
        const profile = await this.profileFactory.create();
        return new Processor(tool, middlewares, profile);
    }
}