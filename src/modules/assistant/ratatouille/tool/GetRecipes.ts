import {Tool} from "../../../tool";
import axios from "axios";
import {RatatouilleOptions} from "../types";
import {getRecipesSchema} from "../schemas";

export class GetRecipes implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    getName(): string {
        return `${this.options.chiefName}-get_recipes`;
    }

    getDescription(): string {
        return "Get a list of all recipes from the Ratatouille API";
    }

    getSchema() {
        return getRecipesSchema.shape;
    }

    getHandler(): (...args: any[]) => Promise<any> {
        return async () => {
            try {
                const response = await axios.get(`${this.options.apiUrl}/api/chief/${this.options.chiefName}/recipe`);
                const recipes = response.data;
                
                const recipeList = recipes.map((recipe: {id: string, summary: string}) => 
                    `[${recipe.id}] ${recipe.summary}`
                ).join('\n');

                return {
                    content: [{
                        type: "text",
                        text: recipeList,
                    }]
                };
            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error fetching recipes: ${error instanceof Error ? error.message : String(error)}`,
                    }]
                };
            }
        };
    }
}