import {Edge} from "@/modules/edge";
import {ProfileService} from "@/modules/profile";
import {Tool} from "@/modules/mcp";
import {RestApiFactory} from "./RestApiFactory";

export abstract class EdgeToolFactory {
    abstract readonly name: string;

    constructor(protected readonly restApiFactory: RestApiFactory, protected readonly profileService: ProfileService) {
    }

    abstract create(edge: Edge): Promise<Tool>;
}