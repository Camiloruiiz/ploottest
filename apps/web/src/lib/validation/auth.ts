import { z } from "zod";

export const magicLinkRequestSchema = z.object({
  email: z.email(),
  next: z.string().optional().default("/"),
});
