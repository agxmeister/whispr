import {Edge} from "@/modules/edge";
import {ProfileService} from "@/modules/profile";
import {Tool} from "@/modules/mcp";
import {RestFactory} from "./RestFactory";

export abstract class EdgeToolFactory {
    abstract readonly name: string;

    constructor(protected readonly restFactory: RestFactory, protected readonly profileService: ProfileService) {
    }

    abstract create(edge: Edge): Promise<Tool>;
}