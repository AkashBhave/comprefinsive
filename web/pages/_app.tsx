import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, Box, extendTheme } from "@chakra-ui/react";

import Header from "@/components/header";

import "@/styles/main.css";

const colors = {
  dark: "#000221",
  light: "#ebebed",
  green: {
    primary: "#2fb366",
  },
  red: {
    primary: "#f50323",
  },
};
const theme = extendTheme({
  colors: colors,
  initialColorMode: "dark",
  useSystemColorMode: false,
  components: {
    Button: {
      baseStyle: {
        color: colors.dark,
        transition: "background-color 0.3s ease",
        borderWidth: "2px !important",
        _hover: {
          textDecoration: "none",
          bgColor: "#8d8e9c !important",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bgColor: "dark",
        color: "light",
      },
    },
  },
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Box bgColor="dark" color="light" textColor="light" w="full" h="full">
          {router.pathname != "/" ? <Header /> : null}
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default App;
