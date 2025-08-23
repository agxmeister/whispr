import {Edge} from "@/modules/edge";
import {Profile} from "@/modules/profile";
import {Tool} from "@/modules/mcp";

export abstract class EdgeTool implements Tool {
    constructor(readonly edge: Edge, readonly profile: Profile) {
    }

    abstract getName(): string;
    abstract getDescription(): string;
    abstract getSchema(): any;
    abstract getHandler(): (...args: any[]) => Promise<any>;
}