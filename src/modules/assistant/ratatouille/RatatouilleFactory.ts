import {Assistant, AssistantFactory} from "../types";
import {Ratatouille} from "./Ratatouille";
import {RatatouilleOptions} from "./types";
import {RatatouilleOptionsSchema} from "./schemas";
import {AskHelpTool} from "./tool";

export class RatatouilleFactory implements AssistantFactory {
    readonly name = "ratatouille";
    readonly options: RatatouilleOptions;

    constructor(options: unknown) {
        this.options = RatatouilleOptionsSchema.parse(options);
    }

    create(): Assistant {
        return new Ratatouille([
            new AskHelpTool(this.options)
        ]);
    }
}