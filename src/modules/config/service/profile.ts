import { Config, Profile } from "../types";

export class ProfileService {
    constructor(private readonly config: Config) {
    }

    getProfile(): Profile {
        return {
            readonly: false,
            ...this.config.profile,
        };
    }
}