import axios from "axios";
import {z as zod} from "zod";
import {Tool} from "@/modules/mcp";
import {RatatouilleOptions} from "../types";
import {askHelpToolSchema} from "./schemas";
import {CallToolResult} from "@modelcontextprotocol/sdk/types.js";
import {formatted} from "@/modules/mcp/decorators";

export class GetHelp implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    readonly name = `${this.options.chiefName.toLowerCase()}-get-help`;
    readonly description = `Use this tool if ${this.options.chiefName} was asked to do something. Typical workflow is getting the list of available guides, picking the guide that fits the most, and execute its steps until completion. This tool also allows to manage guides. Use this ability only if you were explicitly asked to create a new guide or update an existing one.`;
    readonly schema = askHelpToolSchema.shape;

    readonly handler = async ({action}: zod.infer<typeof askHelpToolSchema>): Promise<CallToolResult> => {
        switch (action.type) {
            case "list-guides":
                return await this.listGuides();

            case "get-guide":
                return await this.getGuideDetails(action.guideId);

            case "create-guide":
                return await this.createGuide(action);

            case "update-guide":
                const { guideId, ...updateData } = action;
                return await this.updateGuide(guideId, updateData);

            case "delete-guide":
                return await this.deleteGuide(action.guideId);
        }
    };

    private async listGuides(): Promise<CallToolResult>;
    @formatted
    private async listGuides(): Promise<Record<string, any> | CallToolResult> {
        const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`);
        return response.data;
    }

    private async getGuideDetails(recipeId: string): Promise<CallToolResult>
    @formatted
    private async getGuideDetails(recipeId: string): Promise<Record<string, any> | CallToolResult> {
        const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${recipeId}`);
        return response.data;
    }

    private async createGuide(guideData: any): Promise<CallToolResult>
    @formatted
    private async createGuide(guideData: any): Promise<Record<string, any> | CallToolResult> {
        const response = await axios.post(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`,
            guideData,
        );
        return response.data;
    }

    private async updateGuide(guideId: string, guideData: any): Promise<CallToolResult>
    @formatted
    private async updateGuide(guideId: string, guideData: any): Promise<Record<string, any> | CallToolResult> {
        const response = await axios.put(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`,
            guideData,
        );
        return response.data;
    }

    private async deleteGuide(guideId: string): Promise<CallToolResult>
    @formatted
    private async deleteGuide(guideId: string): Promise<Record<string, any> | CallToolResult> {
        await axios.delete(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`);
        return {
            message: `Guide with identity ${guideId} has been deleted successfully.`
        };
    }
}
