import { Assistant, AssistantFactory } from "./types";
import { ConfigService } from "@/modules/config";

export class AssistantService {
    constructor(readonly assistantFactories: AssistantFactory[], readonly configService: ConfigService) {
    }

    async getAssistants(): Promise<Assistant[]> {
        const config = await this.configService.getConfig();
        
        if (!config.assistants) {
            return [];
        }

        return this.assistantFactories
            .map(factory => factory.create())
            .filter(assistant => config.assistants!.includes(assistant.getName()));
    }
}