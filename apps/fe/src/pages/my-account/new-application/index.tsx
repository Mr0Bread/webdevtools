import React from 'react';
import { Box, Button, Heading } from "@chakra-ui/react";
import { trpc } from "src/utils/trpc";
import ApplicationForm, { FormValues } from 'src/forms/application';
import { useRouter } from "next/router";
import { NextPageWithLayout } from "src/pages/_app";
import MyAccountLayout from "src/layouts/my-account";
import CategoryService from 'src/server/services/category-service';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = async () => {
  const categories = await CategoryService.getLowestCategories()

  return {
    props: {
      categories
    }
  }
}

const NewApplicationPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  categories,
}) => {
  const router = useRouter()
  const {
    mutate: createApplication,
    isLoading,
  } = trpc.useMutation(
    ['application.new'],
    {
      onSuccess: ({ id }) => {
        router.push(`/my-account/applications/${id}`)
      }
    }
  )

  const onSubmit = async (values: FormValues) => {
    console.log(values)
    createApplication({
      title: values.title,
      image: values.image || null,
      description: values.description,
      type: values.type,
      categoryId: values.category,
      price: Number(values.price)
    })
  }
  const onCancel = () => {
    router.back()
  }

  return (
    <>
      <Button
        mb={4}
        colorScheme="red"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Heading>
        New Application
      </Heading>
      <Box
        maxW="container.sm"
        mt={ 6 }
      >
        <ApplicationForm
          onSubmit={ onSubmit }
          categories={ categories }
          isLoading={ isLoading }
        />
      </Box>
    </>
  );
}

NewApplicationPage.getLayout = function (page) {
  return (
    <MyAccountLayout>
      { page }
    </MyAccountLayout>
  )
}

export default NewApplicationPage;
