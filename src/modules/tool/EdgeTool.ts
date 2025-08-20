import {Edge} from "../edge";
import {Profile} from "../config";
import {Tool} from "./types";

export abstract class EdgeTool implements Tool {
    constructor(readonly edge: Edge, readonly profile: Profile) {
    }

    abstract getName(): string;
    abstract getDescription(): string;
    abstract getSchema(): any;
    abstract getHandler(): (...args: any[]) => Promise<any>;
}