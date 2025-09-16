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

        const factories: AssistantFactory[] = [];

        for (const assistant of config.assistants) {
            if (!(assistant.name in this.registry)) {
                continue;
            }

            try {
                const factory = new this.registry[assistant.name](assistant.options);
                factories.push(factory);
            } catch {
            }
        }

        return factories;
    }
}