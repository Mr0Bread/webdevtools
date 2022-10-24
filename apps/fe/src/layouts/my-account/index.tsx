import React, { FC, PropsWithChildren } from 'react';
import { Grid, GridItem, VStack, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const MyAccountLayout: FC<PropsWithChildren> = ({ children }) => {
  const session = useSession()
  const router = useRouter()

  return (
    <Grid
      templateColumns="25% auto"
      gap={6}
    >
      <GridItem
        bgColor="gray.900"
        p={4}
        borderRadius={8}
      >
        {
          session && (
            <Heading
              size="md"
              mb={8}
            >
              {`Welcome back, ${session.data?.user?.name}`}
            </Heading>
          )
        }
        <VStack>
          { [
            {
              link: '/my-account/general',
              label: 'General'
            },
            {
              link: '/my-account/applications',
              label: 'Applications'
            }
          ].map(({ link, label }) => (
            <Link
              passHref
              href={ link }
              key={ link }
            >
              <Button
                w="100%"
                colorScheme={ router.pathname === link ? 'cyan' : 'gray' }
              >
                { label }
              </Button>
            </Link>
          )) }
        </VStack>
      </GridItem>
      <GridItem>
        { children }
      </GridItem>
    </Grid>
  );
}

export default MyAccountLayout;
