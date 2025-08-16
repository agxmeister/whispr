import {Assistant, AssistantFactory} from "../types";
import {Ratatouille} from "./Ratatouille";
import {GetGuides, GetGuideDetails, ManageGuide} from "./tool";
import {RatatouilleOptions} from "./types";

export class RatatouilleFactory implements AssistantFactory {
    constructor(readonly options: RatatouilleOptions) {
    }

    create(): Assistant {
        return new Ratatouille([
            new GetGuides(this.options),
            new GetGuideDetails(this.options),
            new ManageGuide(this.options)
        ], this.options);
    }
}