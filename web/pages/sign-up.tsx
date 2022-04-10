import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

const SignUpPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<[boolean, string]>();

  const router = useRouter();

  const submit = async () => {
    try {
      const newRes = await axios.post(`/api/auth/new`, {
        username,
        password,
        name,
      });
      const res: any = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
      });
      if (res.ok) {
        setResult([true, "Sign in successful"]);
        setTimeout(() => {
          router.push("/overview");
        }, 1000);
      } else {
        setResult([false, "Invalid credentials"]);
      }
    } catch (err) {
      setResult([false, "Invalid credentials"]);
    }
  };

  return (
    <Center h="full" w="full" mt={-15}>
      <FormControl
        w={300}
        h={800}
        as={VStack}
        justifyContent="center"
        spacing={8}
      >
        <Heading fontSize="4xl">Sign Up</Heading>
        <Box w="full">
          <FormLabel htmlFor="username" fontSize="2xl">
            Username
          </FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            borderWidth={2}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="password" fontSize="2xl">
            Password
          </FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            borderWidth={2}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="name" fontSize="2xl">
            Name
          </FormLabel>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            borderWidth={2}
          />
        </Box>
        <Button variant="outline" onClick={submit} fontSize="xl" h={12}>
          Sign Up
        </Button>
        {result != null ? (
          <Alert
            status={result[0] ? "success" : "error"}
            color="dark"
            rounded="base"
          >
            <AlertIcon />
            <AlertDescription>{result[1]}</AlertDescription>
          </Alert>
        ) : null}
      </FormControl>
    </Center>
  );
};

export default SignUpPage;
