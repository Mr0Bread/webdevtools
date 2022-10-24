// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { CategoryRouter } from "./category-router";
import { CategoriesRouter } from "./categories-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('category.', CategoryRouter)
  .merge('categories.', CategoriesRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
