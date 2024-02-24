import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input.text,
          status: input.status,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  update: publicProcedure
    .input(z.object({ text: z.string().min(1), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });
    }),
});
