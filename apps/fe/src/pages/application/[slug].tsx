import React, { FC } from 'react';
import { prisma } from "src/server/db/client";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Box, Button, Heading, HStack, Spacer, VStack, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import {
  FiMail,
} from 'react-icons/fi'

const ApplicationPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
                                                                               application,
                                                                             }) => {

  if (!application) {
    return (
      <div>
        Not found
      </div>
    )
  }

  const {
    title,
    image,
    description,
    user: {
      email,
    }
  } = application

  return (
    <>
      <HStack
        mb={ 6 }
      >
        <Heading>
          { title }
        </Heading>
        <Spacer />
        <Link
          passHref
          href="/applications/all"
        >
          <Button>
            Back to applications
          </Button>
        </Link>
      </HStack>
      <Box
        borderRadius={ 8 }
        overflow="hidden"
        mb={ 6 }
      >
        <img
          src={ image }
          alt="application logo"
        />
      </Box>
      <Heading
        size="md"
        mb={2}
      >
        Description
      </Heading>
      <Box
        p={3}
        border="1px solid"
        borderRadius={ 8 }
        borderColor="gray.700"
        mb={ 6 }
      >
        { description }
      </Box>
      <Heading
        size="md"
        mb={2}
      >
        Contact with Author
      </Heading>
      <VStack
        alignItems="flex-start"
        p={3}
        border="1px solid"
        borderRadius={ 8 }
        borderColor="gray.700"
      >
        <div>
          <ChakraLink
            href={`mailto:${ email }`}
            borderRadius={ 4 }
            backgroundColor="gray.700"
            p={2}
            _hover={{
              textDecoration: 'none',
              backgroundColor: 'gray.600'
            }}
          >
            <Box
              as="span"
              display="inline-flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                me={2}
              >
                Send email
              </Box>
              <FiMail />
            </Box>
          </ChakraLink>
        </div>
      </VStack>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      notFound: true
    }
  }

  const {
    slug,
  } = params;

  const application = await prisma.application.findUnique({
    select: {
      id: true,
      title: true,
      image: true,
      description: true,
      user: {
        select: {
          email: true,
        }
      }
    },
    where: {
      id: slug as string,
    }
  })

  return {
    props: {
      application,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const applications = await prisma.application.findMany({
    select: {
      id: true,
    }
  })

  return {
    paths: applications.map(({ id }) => ({
      params: {
        slug: id,
      }
    })),
    fallback: 'blocking',
  }
}

export default ApplicationPage;
