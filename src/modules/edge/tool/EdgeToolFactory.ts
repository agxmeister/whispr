import {Edge} from "@/modules/edge";
import {ProfileService} from "@/modules/profile";
import {Tool} from "@/modules/mcp";

export abstract class EdgeToolFactory {
    constructor(protected readonly profileService: ProfileService) {
    }

    abstract create(edge: Edge): Promise<Tool>;
}