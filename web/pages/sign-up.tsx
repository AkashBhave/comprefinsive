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
    <Center h="full" w="full">
      <FormControl
        w={300}
        h={800}
        as={VStack}
        justifyContent="center"
        spacing={6}
      >
        <Heading fontSize="4xl">Sign Up</Heading>
        <Box w="full">
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Button onClick={submit}>Sign Up</Button>
        {result != null ? (
          <Alert status={result[0] ? "success" : "error"}>
            <AlertIcon />
            <AlertDescription>{result[1]}</AlertDescription>
          </Alert>
        ) : null}
      </FormControl>
    </Center>
  );
};

export default SignUpPage;
