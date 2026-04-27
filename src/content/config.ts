import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
  }),
});

const claude = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    updated: z.date(),
  }),
});

export const collections = { blog, claude };
