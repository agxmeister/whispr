import {Assistant, AssistantFactory} from "../types";
import {Ratatouille} from "./Ratatouille";
import {RatatouilleOptions} from "./types";
import {AskHelpTool} from "./tool";

export class RatatouilleFactory implements AssistantFactory {
    readonly name = "ratatouille";
    
    constructor(readonly options: RatatouilleOptions) {
    }

    create(): Assistant {
        return new Ratatouille([
            new AskHelpTool(this.options)
        ]);
    }
}