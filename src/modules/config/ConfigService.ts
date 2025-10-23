import { injectable, inject } from "inversify";
import { Config } from "./types";
import { ConfigRepository } from "./ConfigRepository";
import { dependencies } from "@/dependencies";

@injectable()
export class ConfigService {
    constructor(@inject(dependencies.ConfigRepository) readonly configRepository: ConfigRepository) {
    }

    async getConfig(): Promise<Config> {
        return this.configRepository.getConfig();
    }

    async getAssistantOptions<Options>(assistantName: string): Promise<Options | null> {
        const config = await this.getConfig();
        const assistant = config.assistants?.find(a => a.name === assistantName);
        return assistant?.options as Options ?? null;
    }
}