import {Tool} from "../../../tool";
import axios from "axios";
import {RatatouilleOptions} from "../types";
import {getGuidesSchema} from "../schemas";

export class GetGuides implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    getName(): string {
        return `${this.options.chiefName.toLowerCase()}-get-guides`;
    }

    getDescription(): string {
        return `Use this tool if ${this.options.chiefName} was asked to do something. It returns a list of available guides. Then, use ${this.options.chiefName.toLowerCase()}-get-guide-details to get the guide.`;
    }

    getSchema() {
        return getGuidesSchema.shape;
    }

    getHandler(): (...args: any[]) => Promise<any> {
        return async () => {
            try {
                const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`);
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
                        text: `Error fetching guides: ${error instanceof Error ? error.message : String(error)}`,
                    }]
                };
            }
        };
    }
}