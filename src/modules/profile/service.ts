import { injectable, inject } from "inversify";
import { Profile } from "./types";
import { ConfigService } from "@/modules/config";
import { dependencies } from "@/dependencies";

@injectable()
export class ProfileService {
    constructor(@inject(dependencies.ConfigService) private readonly configService: ConfigService) {
    }

    async getProfile(): Promise<Profile> {
        const config = await this.configService.getConfig();
        return {
            readonly: false,
            edge: {
                tools: ["guided-api"],
            },
            ...config.profile,
        };
    }
}