import {Assistant, RegisterAssistant} from "@/modules/assistant";
import {RatatouilleOptionsSchema} from "./schemas";
import {GetHelp} from "./tool";
import {Tool} from "@/modules/tool";

@RegisterAssistant("ratatouille")
export class Ratatouille implements Assistant {
    readonly name = "ratatouille";
    readonly description = "Ratatouille recipe assistant";
    readonly tools: Tool[];

    constructor(options: unknown) {
        const validatedOptions = RatatouilleOptionsSchema.parse(options);
        this.tools = [
            new GetHelp(validatedOptions)
        ];
    }
}