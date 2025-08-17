import {z as zod} from "zod";
import {Tool} from "../../../tool";
import axios from "axios";
import {RatatouilleOptions} from "../types";
import {manageGuideSchema} from "../schemas";

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
        return manageGuideSchema.shape;
    }

    getHandler(): (...args: any[]) => Promise<any> {
        return async (params: zod.infer<typeof manageGuideSchema>) => {
            const action = params.action;
            if (!["create", "update", "delete"].includes(action.type)) {
                return {
                    content: [{
                        type: "text",
                        text: `Error managing guide: action ${action.type} is not supported.`,
                    }],
                    isError: true,
                };
            }

            if (action.type === "create") {
                return await this.createRecipe(action);
            }

            if (action.type === "update") {
                const { recipeId, ...updateData } = action;
                return await this.updateRecipe(recipeId, updateData);
            }

            if (action.type === "delete") {
                return await this.deleteRecipe(action.recipeId);
            }
        };
    }

    private async createRecipe(recipeData: any) {
        const response = await axios.post(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`,
            recipeData
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
            recipeData
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
}