import {Assistant, AssistantFactory} from "../types";
import {Ratatouille} from "./Ratatouille";
import {GetRecipes, GetRecipeDetails} from "./tool";
import {RatatouilleOptions} from "./types";

export class RatatouilleFactory implements AssistantFactory {
    constructor(readonly options: RatatouilleOptions) {
    }

    create(): Assistant {
        return new Ratatouille([
            new GetRecipes(this.options),
            new GetRecipeDetails(this.options)
        ], this.options);
    }
}