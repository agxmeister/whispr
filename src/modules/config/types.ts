import { Edge } from "../edge";

export interface Config {
    edges: Edge[];
    profile?: Profile;
}

export type Profile = {
    readonly?: boolean;
};
