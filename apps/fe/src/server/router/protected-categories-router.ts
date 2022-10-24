import { createProtectedRouter } from "src/server/router/context";
import CategoryService from "src/server/services/category-service";

export const protectedCategoriesRouter = createProtectedRouter()
  .query('lowest', {
    async resolve() {
      return CategoryService.getLowestCategories()
    }
  })
