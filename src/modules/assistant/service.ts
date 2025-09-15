import { AssistantFactory, AssistantRegistry } from "./types";
import { ConfigService } from "@/modules/config";

export class AssistantService {
    constructor(readonly registry: AssistantRegistry, readonly configService: ConfigService)
    {
    }

    async getAssistantFactories(): Promise<AssistantFactory[]> {
        const config = await this.configService.getConfig();

        if (!config.assistants) {
            return [];
        }

        return config.assistants
            .filter(assistant => assistant.name in this.registry)
            .map(assistant => new this.registry[assistant.name](assistant.options));
    }
}