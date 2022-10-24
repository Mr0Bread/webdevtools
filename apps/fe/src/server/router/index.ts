// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedApplicationsRouter } from "src/server/router/protected-applications-router";
import { publicApplicationsRouter } from "src/server/router/public-applications-router";
import { protectedCategoriesRouter } from "src/server/router/protected-categories-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('application.', protectedApplicationsRouter)
  .merge('applications.', publicApplicationsRouter)
  .merge('categories.', protectedCategoriesRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
