import {injectable, inject} from "inversify";
import {dependencies} from "@/dependencies";
import {ProfileFactory} from "@/modules/profile";
import {Tool} from "@/modules/tool";
import {Formatter} from "@/modules/tool/formatter";
import {ProcessorFactory as ProcessorFactoryInterface} from "./types";
import {Middleware} from "../middleware";
import {Processor} from "./Processor";

@injectable()
export class ProcessorFactory implements ProcessorFactoryInterface {
    constructor(@inject(dependencies.ProfileFactory) private readonly profileFactory: ProfileFactory) {}

    async create(tool: Tool, formatter: Formatter, middlewares?: Middleware[]): Promise<Processor> {
        const profile = await this.profileFactory.create();
        return new Processor(tool, formatter, middlewares, profile);
    }
}