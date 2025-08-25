import { AssistantFactory } from "./types";
import { ConfigService } from "@/modules/config";

export class AssistantService {
    constructor(readonly configService: ConfigService, readonly factories: AssistantFactory[])
    {
    }

    async getAssistantFactories(): Promise<AssistantFactory[]> {
        const config = await this.configService.getConfig();
        
        if (!config.assistants) {
            return [];
        }

        return this.factories
            .filter(factory => config.assistants!.includes(factory.name));
    }
}