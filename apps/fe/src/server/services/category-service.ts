import { ApplicationType } from "@prisma/client";
import { prisma } from "src/server/db/client";
import { ArrayElement } from "type-fest/source/exact";

const CategoryService = {
  async getLowestCategories() {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
        children: {
          select: {
            id: true,
          }
        },
      },
    })

    return categories
      .filter(({ children }) => !children.length)
  },
  async getCategoryBySlug(slug: string) {
    const urlKeys = slug
      .split('/')
      .filter(Boolean)

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        urlKey: true,
      },
    })

    const rootUrlKey = urlKeys.shift()
    let current = categories.find(({ urlKey }) => urlKey === rootUrlKey);

    while (urlKeys.length) {
      if (!current) {
        return null
      }

      const nextKey = urlKeys.shift() as string

      const child = await prisma.category.findFirst({
        where: {
          parentId: current.id,
          urlKey: nextKey,
        }
      })

      if (!child) {
        return null
      }

      current = child
    }

    return current
  },
  async getChildrenCategoriesBySlug(slug: string) {
    const category = await this.getCategoryBySlug(slug)

    if (!category) {
      throw new Error(`Category with slug ${slug} not found`)
    }

    return prisma.category.findMany({
      where: {
        parentId: category?.id,
      },
      select: {
        id: true,
        title: true,
        urlKey: true,
        _count: {
          select: {
            applications: true,
          }
        }
      }
    })
  },
  async getApplicationsByCategorySlug(
      slug: string,
      options: {
        filter?: {
          type: ApplicationType | undefined
        },
        sort?: {
          field: string,
          order: 'asc' | 'desc'
        }
      } = {}
    ) {
    const selection = {
      id: true,
      description: true,
      image: true,
      title: true,
      type: true,
      price: true
    };
    const {
      filter,
      sort
    } = options
    const urlKeys = slug
      .split('/')
      .filter(Boolean)

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        urlKey: true,
      },
    })

    const rootUrlKey = urlKeys.shift()
    let current = categories.find(({ urlKey }) => urlKey === rootUrlKey);

    while (urlKeys.length) {
      if (!current) {
        throw new Error('Category was not found')
      }

      const nextKey = urlKeys.shift() as string

      const child = await prisma.category.findFirst({
        where: {
          parentId: current.id,
          urlKey: nextKey,
        }
      })

      if (!child) {
        throw new Error(`Category with urlKey ${nextKey} was not found`)
      }

      current = child
    }

    if (!current) {
      throw new Error(`Category with slug ${slug} was not found`)
    }

    const currentChildren = await prisma.category.findMany({
      select: {
        id: true,
      },
      where: {
        parentId: current.id,
      }
    })

    if (!currentChildren.length) {
      // Return applications assigned to this category
      const result = await prisma.application.findMany({
        select: selection,
        where: {
          categoryId: {
            equals: current.id
          },
          type: filter?.type
        },
        orderBy: sort ? {
          [sort.field]: sort.order,
        } : undefined
      })

      return result.map((application) => ({
        ...application,
        price: application.price.toString()
      }))
    }

    const applications = []

    while (currentChildren.length) {
      const {
        id,
      } = currentChildren.pop() as { id: string }

      const children = await prisma.category.findMany({
        where: {
          parentId: id,
        }
      })

      if (children.length) {
        currentChildren.push(...children)

        continue
      }

      const nextApplications = await prisma.application.findMany({
        select: selection,
        where: {
          categoryId: id,
          type: filter?.type
        },
        orderBy: sort ? {
          [sort.field]: sort.order,
        } : undefined
      })

      applications.push(
        ...nextApplications.map(
          (application) => ({
            ...application,
            price: application.price.toString()
          })
        )
      )
    }

    return applications
  },
  async getCategoriesStaticPaths() {
    const pathSet = new Set<string>();
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        urlKey: true,
        parentId: true,
      }
    })

    const current = categories.find(category => !category.parentId)

    if (!current) {
      throw new Error('Root category was not found')
    }

    const categoryQueue = [current]
    let currentPath = ''

    while (categoryQueue.length) {
      const {
        id,
        urlKey,
      } = categoryQueue.pop() as ArrayElement<typeof categories>

      // Children of current category
      const children = categories.filter(category => category.parentId === id)

      if (children.length) {
        if (urlKey) {
          currentPath += `/${urlKey}`

          pathSet.add(currentPath)
        }

        categoryQueue.push(...children)

        continue
      }

      currentPath += `/${urlKey}`

      pathSet.add(currentPath)

      currentPath = ''
    }

    return Array.from(pathSet.values())
      .map((value) => ({
        params: {
          slug: value.split('/').filter(Boolean)
        }
      }))
  }
}

export default CategoryService
