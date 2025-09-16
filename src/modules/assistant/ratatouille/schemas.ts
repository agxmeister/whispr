import { z as zod } from 'zod';

export const RatatouilleOptionsSchema = zod.object({
    apiUrl: zod.string(),
    chiefName: zod.string(),
});