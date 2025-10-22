import { injectable, inject, Container } from "inversify";
import { Assistant, AssistantConstructor } from "./types";
import { ConfigService } from "@/modules/config";
import { dependencies } from "@/dependencies";
import { AssistantRegistry } from "./AssistantRegistry";

@injectable()
export class AssistantsFactory {
    constructor(@inject(dependencies.ConfigService) readonly configService: ConfigService, @inject(Container) private readonly container: Container)
    {
    }

    async getAssistants(): Promise<Assistant[]> {
        const config = await this.configService.getConfig();

        if (!config.assistants) {
            return [];
        }

        const registry = AssistantRegistry.getInstance();
        const assistants: Assistant[] = [];

        for (const assistant of config.assistants) {
            const assistantSymbol = registry.get(assistant.name);
            if (!assistantSymbol) {
                continue;
            }

            try {
                const AssistantConstructor = this.container.get<AssistantConstructor>(assistantSymbol);
                const instance = new AssistantConstructor(assistant.options);
                assistants.push(instance);
            } catch {
            }
        }

        return assistants;
    }
}