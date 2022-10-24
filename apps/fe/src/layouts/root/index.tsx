import React, { FC, PropsWithChildren } from 'react';
import Header from "../../components/header";
import { Container } from "@chakra-ui/react";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <Container
        maxW="container.xl"
        mt={20}
      >
        {children}
      </Container>
    </>
  );
}

export default RootLayout;
