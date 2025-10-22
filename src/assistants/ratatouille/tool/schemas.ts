import {z as zod} from "zod";

export const listGuidesToolSchema = zod.object({
});

export const getGuideToolSchema = zod.object({
    guideId: zod.string()
        .describe("Identity of the guide."),
});

export const createGuideToolSchema = zod.object({
    summary: zod.string()
        .describe("Brief summary of the guide."),
    description: zod.string()
        .optional()
        .describe("Detailed description of the guide."),
    preconditions: zod.array(zod.string())
        .optional()
        .describe("List of preconditions that should be met before starting."),
    steps: zod.array(zod.string())
        .optional()
        .describe("List of steps to follow."),
    postconditions: zod.array(zod.string())
        .optional()
        .describe("List of postconditions that should be verified after completion."),
});

export const updateGuideToolSchema = zod.object({
    guideId: zod.string()
        .describe("Identity of the guide."),
    summary: zod.string()
        .optional()
        .describe("Brief summary of the guide."),
    description: zod.string()
        .optional()
        .describe("Detailed description of the guide."),
    preconditions: zod.array(zod.string())
        .optional()
        .describe("List of preconditions that should be met before starting."),
    steps: zod.array(zod.string())
        .optional()
        .describe("List of steps to follow."),
    postconditions: zod.array(zod.string())
        .optional()
        .describe("List of postconditions that should be verified after completion."),
});

export const deleteGuideToolSchema = zod.object({
    guideId: zod.string()
        .describe("Identity of the guide."),
});

export const getHelpToolSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-guides"),
        })
            .extend(listGuidesToolSchema.shape)
            .describe("Returns the list of available guides."),
        zod.object({
            type: zod.literal("get-guide"),
        })
            .extend(getGuideToolSchema.shape)
            .describe("Returns the specific guide."),
        zod.object({
            type: zod.literal("create-guide"),
        })
            .extend(createGuideToolSchema.shape)
            .describe("Creates a new guide."),
        zod.object({
            type: zod.literal("update-guide"),
        })
            .extend(updateGuideToolSchema.shape)
            .describe("Updates an existing guide."),
        zod.object({
            type: zod.literal("delete-guide"),
        })
            .extend(deleteGuideToolSchema.shape)
            .describe("Deletes the existing guide."),
    ]),
});
