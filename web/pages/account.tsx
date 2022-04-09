import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";

const providers = [
  {
    type: "wallet",
    key: "12esdfahlskj1",
  },
  {
    type: "coinbase",
    key: "129knmsnda",
  },
  {
    type: "robinhood",
    key: "kasdkl1k21",
  },
];

const Account = () => {
  const del = () => {
    alert("Delete account");
  };

  return (
    <Container as="main" maxW={1000}>
      <Box as="section" textAlign="center" mb={8}>
        <Heading as="h1" fontSize="4xl">
          Account
        </Heading>
      </Box>
      <Box as="section" mb={8}>
        <Heading as="h2" fontSize="3xl" mb={6}>
          Providers
        </Heading>
        <VStack align="start" fontSize="xl">
          {providers.map((p) => (
            <Box key={p.type} textTransform="capitalize">
              {p.type}
            </Box>
          ))}
        </VStack>
      </Box>
      <Box as="section">
        <Heading as="h2" fontSize="3xl" mb={6}>
          Danger Zone
        </Heading>
        <Box fontSize="xl" mb={4}>
          Don&apos;t like {process.env.NAME}?
        </Box>
        <Button colorScheme="red" onClick={del}>
          Delete Your Account
        </Button>
      </Box>
    </Container>
  );
};

export default Account;
