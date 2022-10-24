import React, { FC, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  Link as ChakraLink,
  Modal,
  ModalContent,
  ModalOverlay,
  Spacer,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import {
  BsFillMoonFill,
  BsFillSunFill,
  BsSearch
} from 'react-icons/bs'
import { trpc } from "src/utils/trpc";
import { useRouter } from "next/router";

let throttlePause: boolean;

const throttle = (callback: (...args: any[]) => any, time: number) => {
  //don't run the function if throttlePause is true
  if (throttlePause) return;

  //set throttlePause to true after the if condition. This allows the function to be run once
  throttlePause = true;

  //setTimeout runs the callback within the specified time
  setTimeout(() => {
    callback();

    //throttlePause is set to false once the function has been called, allowing the throttle function to loop
    throttlePause = false;
  }, time);
};

const Header: FC = () => {
  const session = useSession()
  const router = useRouter()
  const {
    toggleColorMode,
    colorMode,
  } = useColorMode()
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const {
    data,
  } = trpc.useQuery(['applications.search', { query: searchQuery }], {
    enabled: !!searchQuery,
  })

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInputValue(e.target.value)

    throttle(() => {
      setSearchQuery(e.target.value)
    }, 250)
  }

  const {
    status
  } = session

  return (
    <Container
      pt={4}
      pb={4}
      pos="fixed"
      top={0}
      w="100%"
      maxW="unset"
      backgroundColor="gray.800"
      zIndex={100}
    >
      <Container
        maxW="container.xl"
      >
        <HStack
          spacing={5}
        >
          <Link
            href="/"
            passHref
          >
            <ChakraLink
              textTransform="uppercase"
              fontWeight="bold"
            >
              Home
            </ChakraLink>
          </Link>
          <Link
            href="/applications/all"
            passHref
          >
            <ChakraLink
              textTransform="uppercase"
              fontWeight="bold"
            >
              Applications
            </ChakraLink>
          </Link>
          <Link
            href="/categories/all"
            passHref
          >
            <ChakraLink
              textTransform="uppercase"
              fontWeight="bold"
            >
              Categories
            </ChakraLink>
          </Link>
          <Spacer />
          <IconButton
            aria-label="Search"
            icon={<BsSearch />}
            onClick={onOpen}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              p={3}
            >
              <Grid
                templateColumns="10% auto"
                rowGap={data && !!data.length ? 3 : 0}
                templateAreas={`
                "searchIcon searchInput"
                "empty searchResults"
                `}
              >
                <GridItem
                  area="searchIcon"
                  justifySelf="center"
                  alignSelf="center"
                >
                  <BsSearch />
                </GridItem>
                <GridItem
                  area="searchInput"
                >
                  <Input
                    onChange={onSearchChange}
                    placeholder="Search"
                    value={searchInputValue}
                  />
                </GridItem>
                {
                  data && (
                    <GridItem
                      area="searchResults"
                    >
                      <VStack
                        spacing={3}
                        alignItems="flex-start"
                      >
                        {
                          data
                            .map(({ title, id }) => (
                              <Button
                                key={id}
                                w="100%"
                                justifyContent="flex-start"
                                onClick={() => {
                                  setSearchInputValue('')
                                  setSearchQuery('')
                                  onClose()
                                  router.push(`/application/${id}`)
                                }}
                              >
                                {title}
                              </Button>
                            ))
                        }
                      </VStack>
                    </GridItem>
                  )
                }
              </Grid>
            </ModalContent>
          </Modal>
          <Button
            onClick={toggleColorMode}
          >
            {
              colorMode === 'dark' ? (
                <BsFillSunFill />
              ) : (
                <BsFillMoonFill />
              )
            }
          </Button>
          {
            status === 'authenticated' && (
              <Link
                passHref
                href="/my-account/new-application"
              >
                <Button
                  colorScheme="green"
                  variant="outline"
                >
                  New Application
                </Button>
              </Link>
            )
          }
          {
            status === 'authenticated' && (
              <Link
                href="/my-account/general"
              >
                My Account
              </Link>
            )
          }
          {
            status === 'unauthenticated' && (
              <Button
                onClick={() => signIn(undefined, { callbackUrl: '/my-account/general' })}
              >
                Sign in
              </Button>
            )
          }
        </HStack>
      </Container>
    </Container>
  );
}

export default Header;
