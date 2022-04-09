import NextLink from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Flex, Text, Button, HStack, Link } from "@chakra-ui/react";

const Header = () => {
  const { data: session } = useSession();
  return (
    <Flex w="100%" px="6" py="5" align="center" justify="space-between">
      <NextLink href="/" passHref>
        <Link
          fontWeight="bold"
          fontSize="xl"
          color="green.700"
          _focus={{ outline: "none" }}
        >
          Comprefinsive
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
          <Button onClick={() => signOut()}>Sign Out</Button>
        </HStack>
      ) : (
        <HStack as="nav" spacing={4}>
          <NextLink href="/sign-in" passHref>
            <Link as={Button}>Sign In</Link>
          </NextLink>
          <NextLink href="/sign-up" passHref>
            <Link as={Button}>Sign Up</Link>
          </NextLink>
        </HStack>
      )}
    </Flex>
  );
};

export default Header;
