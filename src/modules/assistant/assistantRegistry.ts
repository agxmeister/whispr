import { AssistantRegistry } from "./types";
import { RatatouilleFactory } from "@/modules/assistant/ratatouille";

export const assistantRegistry: AssistantRegistry = {
    'ratatouille': RatatouilleFactory
};