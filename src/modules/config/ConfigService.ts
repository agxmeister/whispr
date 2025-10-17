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
}