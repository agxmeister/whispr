import {Edge} from "../edge";
import {ProfileService} from "../config";
import {Tool} from "./types";

export abstract class EdgeToolFactory {
    constructor(protected readonly profileService: ProfileService) {
    }

    abstract create(edge: Edge): Promise<Tool>;
}