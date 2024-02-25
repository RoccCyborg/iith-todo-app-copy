import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  createTodo: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          text: input.text,
          status: false,
        },
      });
    }),
  getTodos: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany();
  }),
  deleteTodo: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({ where: { id: input.id } });
    }),
});
