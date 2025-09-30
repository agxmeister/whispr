import { Edge } from "@/modules/edge";
import { Profile } from "@/modules/profile";

export interface Middleware {
    name: string;
    filter?: {
        edges?: string[];
        tools?: string[];
    }
}

export interface Assistant {
    name: string;
    options: Record<string, any>;
}

export interface Config {
    edges: Edge[];
    middlewares?: Middleware[];
    assistants?: Assistant[];
    profile?: Profile;
}
