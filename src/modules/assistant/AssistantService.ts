import { injectable, inject, Container } from "inversify";
import { Assistant, AssistantFactory } from "./types";
import { ConfigService } from "@/modules/config";
import { dependencies } from "@/dependencies";
import { AssistantRegistry } from "./AssistantRegistry";

@injectable()
export class AssistantService {
    constructor(
        @inject(dependencies.ConfigService) readonly configService: ConfigService,
        @inject(Container) private readonly container: Container
    ) {}

    async getAssistants(): Promise<Assistant[]> {
        const config = await this.configService.getConfig();

        if (!config.assistants) {
            return [];
        }

        const registry = AssistantRegistry.getInstance();
        const assistants: Assistant[] = [];

        for (const assistant of config.assistants) {
            const factorySymbol = registry.get(assistant.name);
            if (!factorySymbol) {
                continue;
            }

            try {
                const factory = this.container.get<AssistantFactory>(factorySymbol);
                const instance = await factory.create();
                assistants.push(instance);
            } catch {
            }
        }

        return assistants;
    }
}