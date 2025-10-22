import {Assistant} from "@/modules/assistant";
import {Tool} from "@/modules/tool";

export class Ratatouille implements Assistant {
    constructor(readonly tools: Tool[]) {
    }

    getName(): string {
        return "ratatouille";
    }

    getDescription(): string {
        return "Ratatouille recipe assistant";
    }

    getTools(): Tool[] {
        return this.tools;
    }
}