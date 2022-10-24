import React from 'react';
import { NextPageWithLayout } from "../_app";
import MyAccountLayout from "../../layouts/my-account";
import { useSession } from "next-auth/react";
import { Box, Heading, HStack, VStack } from "@chakra-ui/react";

const GeneralPage: NextPageWithLayout = () => {
  const session = useSession()

  return (
    <div>
      <Heading
        size="lg"
        mb={ 4 }
      >
        My Account General
      </Heading>
      <VStack
        alignItems="flex-start"
      >
        {
          session.data && (
            <HStack>
              <Box>
                Email:
              </Box>
              <Box>
                { session.data.user?.email }
              </Box>
            </HStack>
          )
        }
      </VStack>
    </div>
  );
}

GeneralPage.getLayout = function (page) {
  return (
    <MyAccountLayout>
      { page }
    </MyAccountLayout>
  )
}

export default GeneralPage;
