import {z as zod} from "zod";
import {Tool} from "../../../tool";
import axios from "axios";
import {RatatouilleOptions} from "../types";
import {getGuideDetailsSchema} from "../schemas";

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
        return getGuideDetailsSchema.shape;
    }

    getHandler(): (...args: any[]) => Promise<any> {
        return async ({recipeId}: zod.infer<typeof getGuideDetailsSchema>) => {
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
                    }]
                };
            }
        };
    }
}