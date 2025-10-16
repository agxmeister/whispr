import { injectable, inject, multiInject } from "inversify";
import { EdgeToolFactory } from "./EdgeToolFactory";
import { ProfileFactory } from "@/modules/profile";
import { dependencies } from "@/dependencies";

@injectable()
export class EdgeToolService {
    constructor(
        @inject(dependencies.ProfileFactory) readonly profileFactory: ProfileFactory,
        @multiInject(dependencies.EdgeToolFactories) readonly factories: EdgeToolFactory[]
    ) {}

    async getEdgeToolFactories(): Promise<EdgeToolFactory[]> {
        const profile = await this.profileFactory.create();
        return this.factories.filter(factory => profile.edge.tools.includes(factory.name));
    }
}