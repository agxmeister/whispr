import { injectable, inject } from "inversify";
import { Container } from "inversify";
import { dependencies } from "@/dependencies";
import { ConfigService } from "@/modules/config";
import { Edge } from "@/modules/edge";
import { Tool } from "@/modules/tool";
import { MiddlewareService as MiddlewareServiceInterface, Middleware } from "./types";
import { MiddlewareRegistry } from "./MiddlewareRegistry";

@injectable()
export class MiddlewareService implements MiddlewareServiceInterface {
    constructor(
        @inject(dependencies.ConfigService) private readonly configService: ConfigService,
        @inject(Container) private readonly container: Container
    ) {}

    async getMiddlewares(edge: Edge, tool: Tool): Promise<Middleware[]> {
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
                const middleware = this.container.get<Middleware>(middlewareSymbol);
                middlewares.push(middleware);
            }
        }

        return middlewares;
    }
}