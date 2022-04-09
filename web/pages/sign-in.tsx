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

const SignInPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<[boolean, string]>();

  const router = useRouter();

  const submit = async () => {
    // e.preventDefault();
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
        <Heading fontSize="4xl">Sign In</Heading>
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
        <Button onClick={submit}>Sign In</Button>
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

export default SignInPage;
