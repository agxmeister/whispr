import {z as zod} from "zod";

export const getRecipesSchema = zod.object({
});

export const getRecipeDetailsSchema = zod.object({
    recipeId: zod.string()
        .describe("Identity of the recipe to retrieve"),
});

export const manageRecipeSchema = zod.object({
    operation: zod.enum(["create", "update", "delete"])
        .describe("The operation to perform: create, update, or delete"),
    recipeId: zod.string()
        .optional()
        .describe("Guide identity (required for update and delete operations)"),
    summary: zod.string()
        .optional()
        .describe("Brief summary of the guide (required for create, optional for update)"),
    description: zod.string()
        .optional()
        .describe("Detailed description of the guide"),
    preconditions: zod.array(zod.string())
        .optional()
        .describe("List of preconditions that should be met before starting"),
    steps: zod.array(zod.string())
        .optional()
        .describe("List of steps to follow"),
    postconditions: zod.array(zod.string())
        .optional()
        .describe("List of postconditions that should be verified after completion"),
});
