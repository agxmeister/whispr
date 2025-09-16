import { z as zod } from 'zod';
import { RatatouilleOptionsSchema } from './schemas';

export type RatatouilleOptions = zod.infer<typeof RatatouilleOptionsSchema>;
