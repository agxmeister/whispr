import {z as zod} from "zod";
import {Tool} from "../../../tool";
import axios from "axios";
import {RatatouilleOptions} from "../types";
import {manageRecipeSchema} from "../schemas";

export class ManageGuide implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    getName(): string {
        return `${this.options.chiefName.toLowerCase()}-manage-guide`;
    }

    getDescription(): string {
        return `Use this tool if ${this.options.chiefName} was asked to create, update, or delete a guide.`
    }

    getSchema() {
        return manageRecipeSchema.shape;
    }

    getHandler(): (...args: any[]) => Promise<any> {
        return async (params: zod.infer<typeof manageRecipeSchema>) => {
            try {
                const { operation, recipeId, ...recipeData } = params;
                
                switch (operation) {
                    case "create":
                        return await this.createRecipe(recipeData);
                    case "update":
                        if (!recipeId) {
                            throw new Error("Guide identity is required for update operation");
                        }
                        return await this.updateRecipe(recipeId, recipeData);
                    case "delete":
                        if (!recipeId) {
                            throw new Error("Guide identity is required for delete operation");
                        }
                        return await this.deleteRecipe(recipeId);
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }
            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error managing guide: ${error instanceof Error ? error.message : String(error)}`,
                    }],
                    isError: true,
                };
            }
        };
    }

    private async createRecipe(recipeData: any) {
        if (!recipeData.summary) {
            throw new Error("Summary is required for creating a guide");
        }

        const response = await axios.post(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`,
            this.cleanRecipeData(recipeData)
        );

        const recipe = response.data;
        return {
            content: [{
                type: "text",
                text: `Guide created successfully!\n\n**ID:** ${recipe.id}\n**Summary:** ${recipe.summary}\n**Created:** ${recipe.createdAt}`,
            }]
        };
    }

    private async updateRecipe(recipeId: string, recipeData: any) {
        const response = await axios.put(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${recipeId}`,
            this.cleanRecipeData(recipeData)
        );

        const recipe = response.data;
        return {
            content: [{
                type: "text",
                text: `Guide updated successfully!\n\n**ID:** ${recipe.id}\n**Summary:** ${recipe.summary}\n**Updated:** ${recipe.updatedAt}`,
            }]
        };
    }

    private async deleteRecipe(recipeId: string) {
        await axios.delete(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${recipeId}`);

        return {
            content: [{
                type: "text",
                text: `Guide with identity "${recipeId}" has been deleted successfully.`,
            }]
        };
    }

    private cleanRecipeData(data: any) {
        const cleanData: any = {};
        
        if (data.summary !== undefined) cleanData.summary = data.summary;
        if (data.description !== undefined) cleanData.description = data.description;
        if (data.preconditions !== undefined) cleanData.preconditions = data.preconditions;
        if (data.steps !== undefined) cleanData.steps = data.steps;
        if (data.postconditions !== undefined) cleanData.postconditions = data.postconditions;
        
        return cleanData;
    }
}