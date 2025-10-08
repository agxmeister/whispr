import axios from "axios";
import {z as zod} from "zod";
import {Tool} from "@/modules/mcp";
import {RatatouilleOptions} from "../types";
import {
    getHelpToolSchema,
    getGuideToolSchema,
    createGuideToolSchema,
    updateGuideToolSchema,
    deleteGuideToolSchema
} from "./schemas";

export class GetHelp implements Tool {
    constructor(readonly options: RatatouilleOptions) {
    }

    readonly name = `${this.options.chiefName.toLowerCase()}-get-help`;
    readonly description = `Use this tool if ${this.options.chiefName} was asked to do something. Typical workflow is getting the list of available guides, picking the guide that fits the most, and execute its steps until completion. This tool also allows to manage guides. Use this ability only if you were explicitly asked to create a new guide or update an existing one.`;
    readonly schema = getHelpToolSchema.shape;

    readonly handler = async ({action}: zod.infer<typeof getHelpToolSchema>) => {
        switch (action.type) {
            case "list-guides":
                return await this.listGuides();

            case "get-guide":
                return await this.getGuideDetails(action);

            case "create-guide":
                return await this.createGuide(action);

            case "update-guide":
                return await this.updateGuide(action);

            case "delete-guide":
                return await this.deleteGuide(action);
        }
    };

    private async listGuides() {
        const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`);
        return response.data;
    }

    private async getGuideDetails({guideId}: zod.infer<typeof getGuideToolSchema>) {
        const response = await axios.get(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`);
        return response.data;
    }

    private async createGuide(guideData: zod.infer<typeof createGuideToolSchema>) {
        const response = await axios.post(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe`,
            guideData,
        );
        return response.data;
    }

    private async updateGuide({guideId, ...guideData}: zod.infer<typeof updateGuideToolSchema>) {
        const response = await axios.put(
            `${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`,
            guideData,
        );
        return response.data;
    }

    private async deleteGuide({guideId}: zod.infer<typeof deleteGuideToolSchema>) {
        await axios.delete(`${this.options.apiUrl}/chief/${this.options.chiefName}/recipe/${guideId}`);
        return {
            message: `Guide with identity ${guideId} has been deleted successfully.`
        };
    }
}
