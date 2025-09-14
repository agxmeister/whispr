import axios from "axios";
import {z as zod} from "zod";
import {Tool} from "@/modules/mcp";
import {RatatouilleOptions} from "../types";
import {askHelpToolSchema} from "./schemas";
import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";

export class AskHelpTool implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    readonly name = `${this.options.chiefName.toLowerCase()}-ask-help`;
    readonly description = `Use this tool if ${this.options.chiefName} was asked to do something. Typical workflow is getting the list of available guides, picking the guide that fits the most, and execute its steps until completion. This tool also allows to manage guides - use this ability only if you were explicitly asked to create a new guide or update an existing one.`;
    readonly schema = askHelpToolSchema.shape;
    readonly handler = async (params: zod.infer<typeof askHelpToolSchema>): Promise<CallToolResult> => {
        const action = params.action;

        if (action.type === "list-guides") {
            return await this.listGuides();
        }

        if (action.type === "get-guide") {
            return await this.getGuideDetails(action.guideId);
        }

        if (action.type === "create-guide") {
            return await this.createGuide(action);
        }

        if (action.type === "update-guide") {
            const { guideId, ...updateData } = action;
            return await this.updateGuide(guideId, updateData);
        }

        if (action.type === "delete-guide") {
            return await this.deleteGuide(action.guideId);
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify({ error: "Unknown action type" }, null, 2),
            }],
            isError: true,
        };
    };

    private async listGuides(): Promise<CallToolResult> {
        try {
            const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`);
            return {
                content: [{
                    type: "text",
                    text: response.data.map((recipe: {id: string, summary: string}) =>
                        `[${recipe.id}] ${recipe.summary}`
                    ).join('\n'),
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: `Error fetching guides: ${error instanceof Error ? error.message : String(error)}`,
                }],
                isError: true,
            };
        }
    }

    private async getGuideDetails(recipeId: string): Promise<CallToolResult> {
        try {
            const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${recipeId}`);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(response.data, null, 4),
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: `Error fetching guide details: ${error instanceof Error ? error.message : String(error)}`,
                }],
                isError: true,
            };
        }
    }

    private async createGuide(guideData: any): Promise<CallToolResult> {
        const response = await axios.post(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`,
            guideData,
        );
        return {
            content: [{
                type: "text",
                text: JSON.stringify(response.data, null, 4),
            }]
        };
    }

    private async updateGuide(guideId: string, guideData: any): Promise<CallToolResult> {
        const response = await axios.put(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`,
            guideData,
        );
        return {
            content: [{
                type: "text",
                text: JSON.stringify(response.data, null, 4),
            }]
        };
    }

    private async deleteGuide(guideId: string): Promise<CallToolResult> {
        await axios.delete(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`);
        return {
            content: [{
                type: "text",
                text: `Guide with identity ${guideId} has been deleted successfully.`,
            }]
        };
    }
}
