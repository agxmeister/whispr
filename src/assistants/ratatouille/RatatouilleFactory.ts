import {Assistant, AssistantFactory, RegisterAssistantFactory} from "@/modules/assistant";
import {GetHelp} from "./tool";
import {injectable, inject} from "inversify";
import {ConfigService} from "@/modules/config";
import {dependencies} from "@/dependencies";
import {Ratatouille} from "./Ratatouille";
import {RatatouilleOptions} from "@/assistants/ratatouille/types";

@injectable()
@RegisterAssistantFactory("ratatouille")
export class RatatouilleFactory implements AssistantFactory {
    constructor(@inject(dependencies.ConfigService) private configService: ConfigService) {
    }

    async create(): Promise<Assistant> {
        const options = await this.configService.getAssistantOptions<RatatouilleOptions>("ratatouille") ?? {
            apiUrl: "https://api.ratatouille.com",
            chiefName: "Ratatouille",
        };

        return new Ratatouille([
            new GetHelp(options)
        ]);
    }
}
