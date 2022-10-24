import { z } from "zod";
import { createProtectedRouter } from "./context";

const newApplicationSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  type: z.enum(['BUY', 'RENT', 'SELL']),
  categoryId: z.string(),
  price: z.number()
})

export type NewApplication = z.infer<typeof newApplicationSchema>

const updateApplicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().nullable(),
  type: z.enum(['BUY', 'RENT', 'SELL']),
  description: z.string(),
  categoryId: z.string(),
});

export type UpdateApplication = z.infer<typeof updateApplicationSchema>

export const protectedApplicationsRouter = createProtectedRouter()
  .mutation('new', {
    input: newApplicationSchema,
    async resolve({ input, ctx }) {
      const {
        title,
        description,
        image,
        type,
        categoryId,
        price
      } = input;
      const {
        session,
        prisma
      } = ctx;

      return prisma.application.create({
        data: {
          title,
          description,
          image,
          userId: session.user.id,
          type,
          categoryId,
          price
        },
        select: {
          id: true,
        }
      })
    }
  })
  .mutation('update', {
    input: updateApplicationSchema,
    async resolve({ input, ctx }) {
      const {
        id,
        title,
        image,
        type,
        categoryId,
      } = input;
      const {
        prisma
      } = ctx;

      return prisma.application.update({
        where: {
          id,
        },
        data: {
          title,
          image,
          type,
          categoryId,
        },
        select: {
          id: true,
        }
      })
    }
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const {
        id,
      } = input;
      const {
        prisma
      } = ctx;

      return prisma.application.delete({
        where: {
          id,
        }
      })
    }
  })
  .query('getByUser', {
    async resolve({ ctx }) {
      const {
        prisma,
        session
      } = ctx;

      return prisma.application.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          title: true,
          image: true,
          type: true,
        }
      })
    }
  })
