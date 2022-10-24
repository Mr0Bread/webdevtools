import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text
} from '@chakra-ui/react';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bargain</title>
        <meta name="description" content="Website where you can find a bargain for a car of your dream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        height="calc(100vh - 80px)"
        display="flex"
        alignItems="center"
      >
        <Grid
          templateColumns="50% auto"
        >
          <GridItem>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              height="100%"
            >
              <Heading
                mb={4}
                textAlign="center"
                size="4xl"
              >
                Car Bargain
              </Heading>
              <Text
                fontSize={20}
                textAlign="center"
                color="blue.300"
              >
                Create or review applications for buying, selling or leasing a car.
              </Text>
              <Text
                fontSize={20}
                textAlign="center"
                color="blue.300"
              >
                Find what suits you best
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              width="100%"
              height="100%"
              position="relative"
            >
              <img
                src="/images/bmw-hero.png"
                alt="hero banner"
                layout="fill"
              />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
