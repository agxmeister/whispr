import { Edge } from "@/modules/edge";
import { Profile } from "@/modules/profile";

export interface Assistant {
    name: string;
    options: Record<string, any>;
}

export interface Config {
    edges: Edge[];
    assistants?: Assistant[];
    profile?: Profile;
}
