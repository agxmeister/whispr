import { Config } from "./types";
import { ConfigRepository } from "./repository";

export class ConfigService {
    constructor(readonly configRepository: ConfigRepository) {
    }

    async getConfig(): Promise<Config> {
        return this.configRepository.getConfig();
    }
}