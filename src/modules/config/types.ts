import { Edge } from "../edge";

export interface Config {
    edges: Edge[];
    assistants?: string[];
    profile?: Profile;
}

export type Profile = {
    readonly?: boolean;
};
