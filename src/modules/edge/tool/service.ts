import { EdgeToolFactory } from "./EdgeToolFactory";
import { ProfileService } from "@/modules/profile";

export class EdgeToolService {
    constructor(readonly profileService: ProfileService, readonly factories: EdgeToolFactory[])
    {
    }

    async getEdgeToolFactories(): Promise<EdgeToolFactory[]> {
        const profile = await this.profileService.getProfile();
        return this.factories.filter(factory => profile.edge.tools.includes(factory.name));
    }
}