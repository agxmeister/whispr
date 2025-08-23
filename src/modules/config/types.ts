import { Edge } from "@/modules/edge";
import { Profile } from "@/modules/profile";

export interface Config {
    edges: Edge[];
    assistants?: string[];
    profile?: Profile;
}
