import {injectable, inject} from "inversify";
import {Edge} from "@/modules/edge";
import {ProfileFactory} from "@/modules/profile";
import {RestFactory} from "./rest/RestFactory";
import {EdgeTool} from "@/modules/edge/tool/EdgeTool";
import {dependencies} from "@/dependencies";

@injectable()
export abstract class EdgeToolFactory {
    abstract readonly name: string;

    constructor(
        @inject(dependencies.RestFactory) protected readonly restFactory: RestFactory,
        @inject(dependencies.ProfileFactory) protected readonly profileFactory: ProfileFactory
    ) {
    }

    abstract create(edge: Edge): Promise<EdgeTool>;
}