import React from 'react';
import { NextPageWithLayout } from "src/pages/_app";
import MyAccountLayout from "src/layouts/my-account";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "src/server/db/client";
import { Box, Button, Heading } from '@chakra-ui/react';
import ApplicationForm, { FormValues } from "src/forms/application";
import { trpc } from "src/utils/trpc";
import Link from 'next/link';
import CategoryService from "src/server/services/category-service";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context)

  if (!session || !session.user?.id || !context.params?.id) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {}
    }
  }

  const result = await prisma.application.findUnique({
    where: {
      id: context.params.id as string
    },
    select: {
      id: true,
      title: true,
      image: true,
      description: true,
      type: true,
      categoryId: true,
      price: true
    }
  })

  const application = result ? {
    ...result,
    price: result.price.toString()
  } : null;

  const lowestCategories = await CategoryService.getLowestCategories()

  return {
    props: {
      application,
      categories: lowestCategories,
    }
  }
}

const MyApplicationPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
                                                                                                         application,
                                                                                                         categories
                                                                                                       }) => {
  const {
    mutate: updateApplication,
    isLoading,
  } = trpc.useMutation(['application.update'])

  if (!application) {
    return (
      <>
        Application not found
      </>
    )
  }

  const {
    title,
    image,
    description,
    type,
    categoryId,
    price
  } = application

  const onSubmit = async (values: FormValues) => {
    updateApplication({
      id: application.id,
      title: values.title,
      image: values.image || null,
      description: values.description,
      type: values.type,
      categoryId: values.category,
    })
  }

  return (
    <>
      <Box
        mb={4}
      >
        <Link
          passHref
          href="/my-account/applications"
        >
          <Button
            colorScheme='red'
          >
            Cancel
          </Button>
        </Link>
      </Box>
      <Heading
        mb={6}
      >
        { title }
      </Heading>
      <ApplicationForm
        onSubmit={ onSubmit }
        initialValues={{
          title,
          image: image || undefined,
          description,
          type,
          category: categoryId,
          price
        }}
        isLoading={ isLoading }
        categories={ categories }
      />
    </>
  );
}

MyApplicationPage.getLayout = function (page) {
  return (
    <MyAccountLayout>
      { page }
    </MyAccountLayout>
  )
}

export default MyApplicationPage;
