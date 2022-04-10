import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

const Account = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [added, setAdded] = useState(false);
  const [result, setResult] = useState<[boolean, string]>();

  const del = () => {
    if (session?.user?.email == null) return;
    axios.delete(`${process.env.API_URL}/${session.user.email}`).then((res) => {
      signOut().then(() => {
        router.push("/");
      });
    });
  };

  const add = () => {
    if (session?.user?.email == null) return;
    if (address == "") return;
    axios
      .post(`${process.env.API_URL}/${session.user.email}/wallet/${address}`)
      .then((res) => {
        setResult([true, "Wallet added successfully"]);
        setAdded(true);
      })
      .catch((err) => setResult([false, "An error occured"]));
  };

  const remove = () => {
    if (session?.user?.email == null) return;
    axios
      .delete(`${process.env.API_URL}/${session.user.email}/wallet`)
      .then((res) => {
        setResult([true, "Wallet removed successfully"]);
        setAdded(false);
      })
      .catch((err) => setResult([false, "An error occured"]));
  };
  return session != null ? (
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
        <VStack align="start" fontSize="2xl" spacing={6}>
          <Text>Robinhood</Text>
          <Text>Coinbase</Text>
          <HStack spacing={4}>
            <Button variant="outline" onClick={add} size="lg" px={8}>
              Add Wallet
            </Button>
            {!added ? (
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                h="50px"
                placeholder="Address"
                fontFamily="JetBrains Mono"
              />
            ) : null}
          </HStack>
          <Button variant="outline" onClick={remove} size="lg" px={8}>
            Remove Wallet
          </Button>
          {result != null ? (
            <Alert
              status={result[0] ? "success" : "error"}
              color="dark"
              rounded="base"
              fontSize="base"
              maxW={500}
            >
              <AlertIcon />
              <AlertDescription>{result[1]}</AlertDescription>
            </Alert>
          ) : null}
        </VStack>
      </Box>
      <Box as="section">
        <Heading as="h2" fontSize="3xl" mb={6}>
          Danger Zone
        </Heading>
        <Box fontSize="xl" mb={4}>
          Don&apos;t like {process.env.NAME}?
        </Box>
        <Button colorScheme="red" onClick={del} size="lg">
          Delete Your Account
        </Button>
      </Box>
    </Container>
  ) : null;
};

export default Account;
