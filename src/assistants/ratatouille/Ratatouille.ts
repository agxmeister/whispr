import {Assistant} from "@/modules/assistant";
import {Tool} from "@/modules/tool";

export class Ratatouille implements Assistant {
    readonly name = "ratatouille";
    readonly description = "Ratatouille recipe assistant";

    constructor(readonly tools: Tool[]) {
    }
}