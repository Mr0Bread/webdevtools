import React, { useRef, useState } from 'react';
import { NextPageWithLayout } from "src/pages/_app";
import MyAccountLayout from "src/layouts/my-account";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { prisma } from "src/server/db/client";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure
} from "@chakra-ui/react";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import { Application } from "@prisma/client";

const MyApplicationsPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  const {
    applications,
  } = props
  const [applicationList, setApplicationList] = useState(applications)
  const applicationToDelete = useRef<string>()
  const {
    refetch: fetchApplications,
  } = trpc.useQuery(['application.getByUser'], {
    enabled: false,
  })
  const refetchApplications = async () => {
    const {
      data,
    } = await fetchApplications()

    setApplicationList(data || [])
  }
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclosure()
  const {
    mutate: deleteApplication,
    isLoading,
  } = trpc.useMutation(
    'application.delete',
    {
      onSuccess: async () => {
        await refetchApplications()
        applicationToDelete.current = ''
        onClose()
      },
    }
  )

  const onDelete = (id: string) => {
    applicationToDelete.current = id
    onOpen()
  }

  return (
    <>
      <Modal
        isOpen={ isOpen }
        onClose={ onClose }
      >
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            Are you sure you want to delete this application?
          </ModalHeader>
          <ModalBody>
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={ 3 }
              onClick={ onClose }
            >
              Close
            </Button>
            <Button
              colorScheme='red'
              onClick={ () => {
                if (applicationToDelete.current) {
                  deleteApplication({
                    id: applicationToDelete.current
                  })
                }
              } }
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SimpleGrid
        columns={ 3 }
        spacing={ 8 }
      >
        {
          applicationList
            .map(({ title, id, image }) => (
              <Box
                key={ id }
              >
                <Box
                  fontSize={ 24 }
                  mb={ 2 }
                >
                  { title }
                </Box>
                {
                  image && (
                    <Box
                      mb={ 4 }
                      borderRadius={ 6 }
                      overflow="hidden"
                    >
                      <img src={ image } alt="application logo"/>
                    </Box>
                  )
                }
                <HStack>
                  <Link
                    passHref
                    href={ `/applications/${ id }` }
                  >
                    <Button>
                      View
                    </Button>
                  </Link>
                  <Link
                    passHref
                    href={ `/my-account/applications/${ id }` }
                  >
                    <Button>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    colorScheme="red"
                    onClick={ () => onDelete(id) }
                    isLoading={ isLoading }
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))
        }
      </SimpleGrid>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  applications: Pick<Application, 'id' | 'image' | 'title'>[]
}> = async (context) => {
  const session = await getServerAuthSession(context)

  if (!session || !session.user?.id) {
    return {
      props: {
        applications: [],
      }
    }
  }

  const applications = await prisma.application.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      title: true,
      id: true,
      image: true,
    }
  })

  return {
    props: {
      applications,
    }
  }
}

MyApplicationsPage.getLayout = function (page) {
  return (
    <MyAccountLayout>
      { page }
    </MyAccountLayout>
  )
}

export default MyApplicationsPage;
