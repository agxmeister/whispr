import {Assistant} from "../types";
import {Tool} from "../../tool";
import {RatatouilleOptions} from "./types";

export class Ratatouille implements Assistant {
    constructor(readonly tools: Tool[], readonly options: RatatouilleOptions) {
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

    getOptions(): RatatouilleOptions {
        return this.options;
    }
}