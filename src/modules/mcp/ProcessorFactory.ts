import {injectable, inject} from "inversify";
import {Tool, ProcessorFactory as ProcessorFactoryInterface} from "./types";
import {Middleware} from "./middleware";
import {Processor} from "./Processor";
import {ProfileService} from "@/modules/profile";
import {dependencies} from "@/dependencies";

@injectable()
export class ProcessorFactory implements ProcessorFactoryInterface {
    constructor(@inject(dependencies.ProfileService) private readonly profileService: ProfileService) {}

    async create(tool: Tool, middlewares?: Middleware[]): Promise<Processor> {
        const profile = await this.profileService.getProfile();
        return new Processor(tool, middlewares, profile);
    }
}