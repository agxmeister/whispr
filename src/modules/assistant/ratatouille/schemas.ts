import {z as zod} from "zod";

export const getRecipesSchema = zod.object({
});

export const getRecipeDetailsSchema = zod.object({
    recipeId: zod.string()
        .describe("Identity of the recipe to retrieve"),
});
