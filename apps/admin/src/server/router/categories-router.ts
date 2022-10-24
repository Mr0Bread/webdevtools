import { createRouter } from "./context";

export const CategoriesRouter = createRouter()
    .query(
        'all',
        {
            async resolve({ ctx }) {
                const {
                    prisma
                } = ctx

                return prisma.category.findMany({
                    select: {
                        id: true,
                        name: true,
                        title: true,
                        urlKey: true,
                        parent: {
                            select: { 
                                name: true,
                            }
                        }
                    }
                })
            }
        }
    )