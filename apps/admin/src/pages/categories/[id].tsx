import React, { FC } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from 'src/server/db/client'
import {
  Typography,
  Button,
} from 'antd'
import CategoryForm from 'src/forms/category';
import Link from 'next/link';
import { trpc } from 'src/utils/trpc';

const CategoryPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  category,
  categories
}) => {
  const {
    mutate,
    isLoading
  } = trpc.useMutation('category.update')

  if (!category) {
    return (
      <>
        <Link
          passHref
          href="/categories"
        >
          <Button
            danger
          >
            Back
          </Button>
        </Link>
        <Typography>
          Category not found
        </Typography>
      </>
    )
  }
  return (
    <>
      <Link
        passHref
        href="/categories"
      >
        <Button
          danger
        >
          Back
        </Button>
      </Link>
      <Typography.Title
        level={2}
      >
        {category.title}
      </Typography.Title>
      <CategoryForm
        category={category}
        categories={categories}
        onSubmit={(values) => mutate({
          id: category.id,
          name: values.name,
          title: values.title,
          urlKey: values.urlKey || undefined,
          parentId: values.parentId || undefined,
        })}
        isLoading={isLoading}
      />
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    params,
  } = ctx

  const {
    id,
  } = params as { id: string }

  const category = await prisma.category.findUnique({
    select: {
      id: true,
      title: true,
      name: true,
      urlKey: true,
      parentId: true,
    },
    where: {
      id: id as string,
    }
  })
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    }
  })

  return {
    props: {
      category,
      categories,
    }
  }
}

export default CategoryPage;
