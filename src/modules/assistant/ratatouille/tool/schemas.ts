import {z as zod} from "zod";

export const askHelpToolSchema = zod.object({
    action: zod.union([
        zod.object({
            type: zod.literal("list-guides"),
        })
            .describe("Returns the list of available guides."),
        zod.object({
            type: zod.literal("get-guide"),
            guideId: zod.string()
                .describe("Identity of the guide."),
        })
            .describe("Returns the specific guide."),
        zod.object({
            type: zod.literal("create-guide"),
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
        })
            .describe("Creates a new guide."),
        zod.object({
            type: zod.literal("update-guide"),
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
        })
            .describe("Updates an existing guide."),
        zod.object({
            type: zod.literal("delete-guide"),
            guideId: zod.string()
                .describe("Identity of the guide."),
        })
            .describe("Deletes the existing guide."),
    ]),
});
