import {Assistant, RegisterAssistant} from "@/modules/assistant";
import {RatatouilleOptionsSchema} from "./schemas";
import {GetHelp} from "./tool";
import {Tool} from "@/modules/tool";
import {injectable, inject} from "inversify";
import {ConfigService} from "@/modules/config";
import {dependencies} from "@/dependencies";

@RegisterAssistant("ratatouille")
@injectable()
export class Ratatouille implements Assistant {
    readonly name = "ratatouille";
    readonly description = "Ratatouille recipe assistant";
    readonly tools: Tool[] = [];

    constructor(@inject(dependencies.ConfigService) private configService: ConfigService) {
    }

    async initialize(): Promise<void> {
        const options = await this.configService.getAssistantOptions("ratatouille");
        const validatedOptions = RatatouilleOptionsSchema.parse(options);
        this.tools.push(new GetHelp(validatedOptions));
    }
}