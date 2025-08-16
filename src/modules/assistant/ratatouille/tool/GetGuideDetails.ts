import {z as zod} from "zod";
import {Tool} from "../../../tool";
import axios from "axios";
import {RatatouilleOptions} from "../types";
import {getRecipeDetailsSchema} from "../schemas";

export class GetGuideDetails implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    getName(): string {
        return `${this.options.chiefName.toLowerCase()}-get-guide-details`;
    }

    getDescription(): string {
        return `Use this tool if ${this.options.chiefName} was asked to do something and you know a guide identity. It returns the guide. Then, follow the guide to completion.`;
    }

    getSchema() {
        return getRecipeDetailsSchema.shape;
    }

    getHandler(): (...args: any[]) => Promise<any> {
        return async ({recipeId}: zod.infer<typeof getRecipeDetailsSchema>) => {
            try {
                const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${recipeId}`);
                const recipe = response.data;
                
                let formattedText = `# Guide: ${recipe.summary}\n\n`;
                
                if (recipe.description) {
                    formattedText += `**Description:**\n${recipe.description}\n\n`;
                }
                
                if (recipe.preconditions && recipe.preconditions.length > 0) {
                    formattedText += `**Preconditions:**\n`;
                    recipe.preconditions.forEach((precondition: string, index: number) => {
                        formattedText += `${index + 1}. ${precondition}\n`;
                    });
                    formattedText += '\n';
                }
                
                if (recipe.steps && recipe.steps.length > 0) {
                    formattedText += `**Steps:**\n`;
                    recipe.steps.forEach((step: string, index: number) => {
                        formattedText += `${index + 1}. ${step}\n`;
                    });
                    formattedText += '\n';
                }
                
                if (recipe.postconditions && recipe.postconditions.length > 0) {
                    formattedText += `**Postconditions:**\n`;
                    recipe.postconditions.forEach((postcondition: string, index: number) => {
                        formattedText += `${index + 1}. ${postcondition}\n`;
                    });
                    formattedText += '\n';
                }
                
                if (recipe.createdAt) {
                    formattedText += `*Created: ${recipe.createdAt}*\n`;
                }
                if (recipe.updatedAt) {
                    formattedText += `*Updated: ${recipe.updatedAt}*\n`;
                }

                return {
                    content: [{
                        type: "text",
                        text: formattedText,
                    }]
                };
            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error fetching guide details: ${error instanceof Error ? error.message : String(error)}`,
                    }]
                };
            }
        };
    }
}