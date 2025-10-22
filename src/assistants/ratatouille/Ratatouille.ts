import {Assistant, RegisterAssistant} from "@/modules/assistant";
import {RatatouilleOptionsSchema} from "./schemas";
import {GetHelp} from "./tool";
import {Tool} from "@/modules/tool";

@RegisterAssistant("ratatouille")
export class Ratatouille implements Assistant {
    private readonly tools: Tool[];

    constructor(options: unknown) {
        const validatedOptions = RatatouilleOptionsSchema.parse(options);
        this.tools = [
            new GetHelp(validatedOptions)
        ];
    }

    getName(): string {
        return "ratatouille";
    }

    getDescription(): string {
        return "Ratatouille recipe assistant";
    }

    getTools(): Tool[] {
        return this.tools;
    }
}