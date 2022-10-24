import {createRouter} from "src/server/router/context";
import {z} from "zod";
import CategoryService from "src/server/services/category-service";

const filterSchema = z.object({
  type: z.union([
    z.undefined(),
    z.tuple([z.union([
      z.literal("BUY"),
      z.literal("SELL"),
      z.literal("RENT"),
    ])]),
    z.tuple([
      z.union([
        z.literal("BUY"),
        z.literal("SELL"),
        z.literal("RENT"),
      ]),
      z.union([
        z.literal("BUY"),
        z.literal("SELL"),
        z.literal("RENT"),
      ]),
    ]),
    z.tuple([
      z.union([
        z.literal("BUY"),
        z.literal("SELL"),
        z.literal("RENT"),
      ]),
      z.union([
        z.literal("BUY"),
        z.literal("SELL"),
        z.literal("RENT"),
      ]),
      z.union([
        z.literal("BUY"),
        z.literal("SELL"),
        z.literal("RENT"),
      ]),
    ]),
  ]).optional(),
})

const sortSchema = z.object({
  field: z.string(),
  order: z.union([z.literal('asc'), z.literal('desc')])
}).optional()

const getApplicationsSchema = z.object({
  filter: filterSchema,
  sort: sortSchema,
  category: z.object({
    slug: z.string()
  })
})

export const publicApplicationsRouter = createRouter()
  .query('get', {
    input: getApplicationsSchema,
    async resolve({ctx, input}) {
      const {
        filter,
        sort,
        category: {
          slug
        }
      } = input;

      return CategoryService.getApplicationsByCategorySlug(
        slug,
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          filter,
          sort
        }
      )
    }
  })
  .query('search', {
    input: z.object({
      query: z.string(),
    }),
    async resolve({ctx, input}) {
      const {
        prisma,
      } = ctx
      const {
        query,
      } = input

      return prisma.application.findMany({
        where: {
          OR: [
            {
              description: {
                contains: query,
              }
            },
            {
              title: {
                contains: query,
              },
            }
          ]
        }
      })
    }
  })
