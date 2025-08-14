import {Edge} from "../edge";
import {Tool} from "./types";

export abstract class EdgeTool implements Tool {
    constructor(readonly edge: Edge) {
    }

    abstract getName(): string;
    abstract getDescription(): string;
    abstract getSchema(): any;
    abstract getHandler(): (...args: any[]) => Promise<any>;
}