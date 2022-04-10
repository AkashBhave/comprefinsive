import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Flex, Text, Button, HStack, Link } from "@chakra-ui/react";

const Header = () => {
  const { data: session } = useSession();
  return (
    <Flex w="100%" px="6" py="5" align="center" justify="space-between">
      <NextLink href="/" passHref>
        <Link fontWeight="bold" fontSize="2xl" _focus={{ outline: "none" }}>
          {process.env.NAME}
        </Link>
      </NextLink>
      {session ? (
        <HStack spacing={4}>
          <Text>
            Hello,{" "}
            <Text as="span" fontWeight="bold">
              {session.user?.name}
            </Text>
          </Text>
          <NextLink href="/overview" passHref>
            <Button variant="outline" as="a">
              Overview
            </Button>
          </NextLink>
          <NextLink href="/account" passHref>
            <Button variant="outline" as="a">
              Account
            </Button>
          </NextLink>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </HStack>
      ) : (
        <HStack as="nav" spacing={4}>
          <NextLink href="/sign-in" passHref>
            <Button variant="outline" as="a">
              Sign In
            </Button>
          </NextLink>
          <NextLink href="/sign-up" passHref>
            <Button variant="outline" as="a">
              Sign Up
            </Button>
          </NextLink>
        </HStack>
      )}
    </Flex>
  );
};

export default Header;
