import {Edge} from "./types";
import {ConfigService} from "@/modules/config";

export class EdgeRepository {
    constructor(readonly configService: ConfigService) {
    }

    async getAll(): Promise<Edge[]> {
        const config = await this.configService.getConfig();
        return config.edges;
    }
}
