import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {Tool} from "@/modules/mcp";

export abstract class EdgeTool implements Tool {
    constructor(readonly edge: Edge, readonly profile: Profile) {
    }

    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly schema: any;
    abstract readonly handler: (...args: any[]) => Promise<any>;
}