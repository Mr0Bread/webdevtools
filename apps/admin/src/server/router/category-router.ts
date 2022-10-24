import { z } from "zod";
import { createRouter } from "./context";

export const CategoryRouter = createRouter()
    .mutation(
        'create',
        {
            input: z.object({
                name: z.string(),
                title: z.string(),
                urlKey: z.string().optional(),
                parentId: z.string().optional(),
            }),
            async resolve({ ctx, input }) {
                const {
                    prisma
                } = ctx

                return prisma.category.create({
                    data: {
                        name: input.name,
                        title: input.title,
                        urlKey: input.urlKey,
                        parent: {
                            connect: {
                                id: input.parentId
                            }
                        }
                    }
                })
            }
        }
    )
    .mutation(
        'update',
        {
            input: z.object({
                id: z.string(),
                name: z.string().optional(),
                title: z.string().optional(),
                urlKey: z.string().optional(),
                parentId: z.string().optional(),
            }),
            async resolve({ input, ctx }) {
                const {
                    id,
                    name,
                    title,
                    urlKey,
                    parentId,
                } = input
                const {
                    prisma
                } = ctx

                return prisma.category.update({
                    where: {
                        id,
                    },
                    data: {
                        name,
                        title,
                        urlKey,
                        parentId,
                    }
                })
            }
        }
    )
    .mutation(
        'delete',
        {
            input: z.object({
                id: z.string()
            }),
            async resolve({ ctx, input }) {
                const {
                    id
                } = input
                const {
                    prisma
                } = ctx

                return prisma.category.delete({
                    where: {
                        id
                    }
                })
            }
        }
    )