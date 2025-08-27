import {Edge} from "@/modules/edge";
import {Tool} from "@/modules/mcp";
import {RestApi} from "./RestApi";

export abstract class EdgeTool implements Tool {
    constructor(readonly edge: Edge, protected readonly restApi: RestApi) {
    }

    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly schema: any;
    abstract readonly handler: (...args: any[]) => Promise<any>;
}