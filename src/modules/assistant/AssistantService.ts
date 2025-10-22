import { injectable, inject, Container } from "inversify";
import { AssistantFactory } from "./types";
import { ConfigService } from "@/modules/config";
import { dependencies } from "@/dependencies";
import { AssistantRegistry } from "./AssistantRegistry";

@injectable()
export class AssistantService {
    constructor(@inject(dependencies.ConfigService) readonly configService: ConfigService, @inject(Container) private readonly container: Container)
    {
    }

    async getAssistantFactories(): Promise<AssistantFactory[]> {
        const config = await this.configService.getConfig();

        if (!config.assistants) {
            return [];
        }

        const registry = AssistantRegistry.getInstance();
        const factories: AssistantFactory[] = [];

        for (const assistant of config.assistants) {
            const assistantSymbol = registry.get(assistant.name);
            if (!assistantSymbol) {
                continue;
            }

            try {
                const FactoryConstructor = this.container.get<new (options: any) => AssistantFactory>(assistantSymbol);
                const factory = new FactoryConstructor(assistant.options);
                factories.push(factory);
            } catch {
            }
        }

        return factories;
    }
}