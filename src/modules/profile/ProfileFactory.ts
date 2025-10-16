import { injectable, inject } from "inversify";
import { Profile, ProfileFactory as ProfileFactoryInterface } from "./types";
import { ConfigService } from "@/modules/config";
import { dependencies } from "@/dependencies";

@injectable()
export class ProfileFactory implements ProfileFactoryInterface {
    constructor(@inject(dependencies.ConfigService) private readonly configService: ConfigService) {
    }

    async create(): Promise<Profile> {
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