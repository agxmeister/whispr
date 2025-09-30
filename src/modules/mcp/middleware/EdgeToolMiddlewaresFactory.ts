import {EdgeToolMiddlewaresFactory as EdgeToolMiddlewaresFactoryInterface, Middleware} from "./types";
import {Tool} from "../types";
import {Edge} from "@/modules/edge";
import {ConfigService} from "@/modules/config";
import {MiddlewareRegistry} from "./MiddlewareRegistry";
import {container} from "@/container";

export class EdgeToolMiddlewaresFactory implements EdgeToolMiddlewaresFactoryInterface {
    constructor(private readonly configService: ConfigService) {}

    async create(edge: Edge, tool: Tool): Promise<Middleware[]> {
        const config = await this.configService.getConfig();
        const registry = MiddlewareRegistry.getInstance();
        const middlewares: Middleware[] = [];

        const middlewareConfigs = config.middlewares || [];

        for (const middlewareConfig of middlewareConfigs) {
            if (middlewareConfig.filter && middlewareConfig.filter.edges && !middlewareConfig.filter.edges.includes(edge.name)) {
                continue;
            }

            if (middlewareConfig.filter && middlewareConfig.filter.tools && !middlewareConfig.filter.tools.includes(tool.name)) {
                continue;
            }

            const middlewareSymbol = registry.get(middlewareConfig.name);
            if (middlewareSymbol) {
                const middleware = container.get<Middleware>(middlewareSymbol);
                middlewares.push(middleware);
            }
        }

        return middlewares;
    }
}