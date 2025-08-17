import {z as zod} from "zod";

export const getGuidesSchema = zod.object({
});

export const getGuideDetailsSchema = zod.object({
    recipeId: zod.string()
        .describe("Identity of the recipe to retrieve"),
});

export const manageGuideSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("create"),
            summary: zod.string()
                .describe("Brief summary of the guide"),
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
        }),
        zod.object({
            type: zod.literal("update"),
            recipeId: zod.string()
                .describe("Guide identity to update"),
            summary: zod.string()
                .optional()
                .describe("Brief summary of the guide"),
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
        }),
        zod.object({
            type: zod.literal("delete"),
            recipeId: zod.string()
                .describe("Guide identity to delete"),
        }),
    ]),
});
