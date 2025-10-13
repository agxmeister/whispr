import { injectable, inject } from "inversify";
import {Edge} from "./types";
import {ConfigService} from "@/modules/config";
import { dependencies } from "@/dependencies";

@injectable()
export class EdgeRepository {
    constructor(@inject(dependencies.ConfigService) readonly configService: ConfigService) {
    }

    async getAll(): Promise<Edge[]> {
        const config = await this.configService.getConfig();
        return config.edges;
    }
}
