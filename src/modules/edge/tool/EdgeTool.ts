import {Edge} from "@/modules/edge";
import {Tool} from "@/modules/mcp";
import {Rest} from "./rest/Rest";

export abstract class EdgeTool implements Tool {
    constructor(readonly edge: Edge, protected readonly rest: Rest) {
    }

    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly schema: any;
    abstract handler(...args: any[]): Promise<any>;
}