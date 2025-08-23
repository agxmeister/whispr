import {Edge} from "../index";
import {ProfileService} from "../../profile";
import {Tool} from "../../mcp";

export abstract class EdgeToolFactory {
    constructor(protected readonly profileService: ProfileService) {
    }

    abstract create(edge: Edge): Promise<Tool>;
}