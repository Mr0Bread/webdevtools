import React, { FC } from 'react';
import { Button, Heading } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

const SignInForm: FC = () => {
  return (
    <>
      <Heading>
        Sign In
      </Heading>
      <Button
        onClick={() => signIn()}
        mt={4}
      >
        Sign in
      </Button>
    </>
  );
}

export default SignInForm;
