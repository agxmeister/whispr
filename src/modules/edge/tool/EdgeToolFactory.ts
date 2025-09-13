import {Edge} from "@/modules/edge";
import {ProfileService} from "@/modules/profile";
import {RestFactory} from "./rest/RestFactory";
import {EdgeTool} from "@/modules/edge/tool/EdgeTool";

export abstract class EdgeToolFactory {
    abstract readonly name: string;

    constructor(protected readonly restFactory: RestFactory, protected readonly profileService: ProfileService) {
    }

    abstract create(edge: Edge): Promise<EdgeTool>;
}