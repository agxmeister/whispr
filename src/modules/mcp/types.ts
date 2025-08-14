import {Edge} from "../edge";

export type ToolDefinition = {
    getName: (edge: Edge) => string;
    getDescription: (edge: Edge) => string;
    getSchema: (edge: Edge) => any;
    getHandler: (edge: Edge) => any;
};
