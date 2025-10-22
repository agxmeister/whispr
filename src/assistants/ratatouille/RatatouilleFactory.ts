import {Assistant, AssistantFactory, RegisterAssistant} from "@/modules/assistant";
import {Ratatouille} from "./Ratatouille";
import {RatatouilleOptions} from "./types";
import {RatatouilleOptionsSchema} from "./schemas";
import {GetHelp} from "./tool";

@RegisterAssistant("ratatouille")
export class RatatouilleFactory implements AssistantFactory {
    readonly name = "ratatouille";
    readonly options: RatatouilleOptions;

    constructor(options: unknown) {
        this.options = RatatouilleOptionsSchema.parse(options);
    }

    create(): Assistant {
        return new Ratatouille([
            new GetHelp(this.options)
        ]);
    }
}