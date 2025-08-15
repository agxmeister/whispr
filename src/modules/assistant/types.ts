import {Tool} from "../tool";

export interface Assistant {
    getName(): string;
    getDescription(): string;
    getTools(): Tool[];
}

export interface AssistantFactory {
    create(options?: Record<string, string>): Assistant;
}