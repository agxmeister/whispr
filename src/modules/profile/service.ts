import { Profile } from "./types";
import { ConfigService } from "../config";

export class ProfileService {
    constructor(private readonly configService: ConfigService) {
    }

    async getProfile(): Promise<Profile> {
        const config = await this.configService.getConfig();
        return {
            readonly: false,
            ...config.profile,
        };
    }
}