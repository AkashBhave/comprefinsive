import type { NextPage } from "next";
import NextLink from "next/link";
import Image from "next/image";
import { Box, Button, Center, Heading, Text, Link } from "@chakra-ui/react";

const IndexPage: NextPage = () => (
  <Box w="full" h={900} pos="relative" id="hero">
    <Center
      pos="absolute"
      top={0}
      left={0}
      padding={12}
      w="full"
      h="full"
      justifyContent="center"
      zIndex={10}
      mixBlendMode="hard-light"
    >
      <Box textAlign="center" mixBlendMode="hard-light">
        <Heading fontSize={{ base: "5xl", xl: "8em" }} as="h1" mb={4}>
          Comprefinsive
        </Heading>
        <Text
          fontSize={{ base: "4xl", xl: "6xl" }}
          mixBlendMode="darken"
          fontWeight="bold"
          opacity={0.8}
          mb={8}
        >
          The one-stop shop for all your investments.
        </Text>
        <NextLink href="/sign-up" passHref>
          <Link
            as={Button}
            fontWeight="bold"
            fontSize="2xl"
            _focus={{ outline: "none" }}
            variant="outline"
            borderColor="gray.900"
            borderWidth={2}
            display="inline-block"
            h={20}
            bgColor="transparent"
            _hover={{ bgColor: "gray.500" }}
          >
            Sign Up Today!
          </Link>
        </NextLink>
      </Box>
    </Center>
    <Image
      src="/hero.jpg"
      alt="Hero image"
      layout="fill"
      objectFit="cover"
      style={{ opacity: 0.1, filter: "grayscale(70%) brightness(90%)" }}
    />
  </Box>
);

export default IndexPage;
