import { Edge } from "@/modules/edge";
import { Profile } from "@/modules/profile";

export interface Assistant {
    name: string;
    options: Record<string, any>;
}

export interface Config {
    edges: Edge[];
    middlewares?: {
        filter?: {
            edges?: string[];
            tools?: string[];
        }
    };
    assistants?: Assistant[];
    profile?: Profile;
}
