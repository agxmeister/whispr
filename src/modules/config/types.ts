import { Edge } from "../edge";
import { Profile } from "../profile";

export interface Config {
    edges: Edge[];
    assistants?: string[];
    profile?: Profile;
}
