import { injectable, inject } from "inversify";
import { EdgeToolFactory } from "./EdgeToolFactory";
import { ProfileService } from "@/modules/profile";
import { dependencies } from "@/dependencies";

@injectable()
export class EdgeToolService {
    constructor(
        @inject(dependencies.ProfileService) readonly profileService: ProfileService,
        @inject(dependencies.EdgeToolFactories) readonly factories: EdgeToolFactory[]
    ) {}

    async getEdgeToolFactories(): Promise<EdgeToolFactory[]> {
        const profile = await this.profileService.getProfile();
        return this.factories.filter(factory => profile.edge.tools.includes(factory.name));
    }
}