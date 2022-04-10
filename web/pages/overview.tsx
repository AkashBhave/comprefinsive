import type { NextPage, GetServerSideProps } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import {
  Box,
  Badge,
  Container,
  Heading,
  HStack,
  Text,
  Divider,
  StackDivider,
  VStack,
  Link,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";

import AreaChart from "@/components/area-chart";
import PieChart from "@/components/pie-chart";
import { ArrowForwardIcon, ArrowLeftIcon } from "@chakra-ui/icons";

const currency = (n: number) =>
  n
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const OverviewPage: NextPage<{ assets: any; portfolio: any }> = ({
  assets,
  portfolio,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  return session != null ? (
    <Box as="main">
      <Container as="section" textAlign="center">
        <Heading as="h2" fontSize="4xl" mb={6}>
          Account Value
        </Heading>
        <Text
          fontSize="6xl"
          fontWeight="bold"
          fontFamily="JetBrains Mono"
          color="green.900"
        >
          $
          {portfolio == null || portfolio.length == 0
            ? "0.00"
            : `${currency(portfolio[portfolio.length - 1][1])}`}
        </Text>
        <Text fontSize="4xl" color="green.500" fontFamily="JetBrains Mono">
          +
          {portfolio == null || portfolio.length == 0
            ? "0.0"
            : `${(
                (portfolio[portfolio.length - 1][1] / portfolio[0][1]) *
                100
              ).toFixed(1)}`}
          %
        </Text>
      </Container>
      <Divider maxW={1000} mx="auto" my={6} px={8} />
      <HStack p={8} spacing={10} divider={<StackDivider />} justify="center">
        <Box as="section" mb={12}>
          <Heading as="h2" fontSize="4xl" mb={8}>
            Performance
          </Heading>
          <AreaChart width={1000} height={400} data={portfolio} />
        </Box>
        <Box as="section">
          <Heading as="h2" fontSize="4xl" mb={8}>
            Breakdown
          </Heading>
          <PieChart width={500} height={400} />
        </Box>
      </HStack>
      <Divider maxW={1000} mx="auto" my={6} px={8} />
      <Container maxW={1200} as="section" textAlign="center" pb={8}>
        <Heading as="h2" fontSize="4xl" mb={6}>
          Assets
        </Heading>
        <HStack
          w="full"
          align="start"
          justify="center"
          spacing={10}
          divider={<StackDivider />}
        >
          <Box w="50%">
            <Heading as="h3" fontSize="3xl" mb={6}>
              Equities
            </Heading>
            <VStack spacing={6} align="start" fontSize="2xl">
              {assets
                .filter((a: any) => a.category === "equity")
                .sort((a: any, b: any) => b.change - a.change)
                .map((a: any) => (
                  <HStack key={a.symbol.toUpperCase()} spacing={4} w="full">
                    <Badge fontSize="xl" p={2} fontFamily="JetBrains Mono">
                      {a.symbol.toLocaleUpperCase()}
                    </Badge>
                    <Text fontSize="lg" align="start">
                      {a.name}
                    </Text>
                    <Box flex={1} />
                    <Text fontFamily="JetBrains Mono">
                      ${currency(a.quoteBalance)}
                    </Text>
                    <Text
                      fontFamily="JetBrains Mono"
                      color={a.change > 0 ? "green.500" : "red.500"}
                    >
                      {a.change > 0 ? "+" : "-"}
                      {Math.abs(a.change * 100).toFixed(1)}%
                    </Text>
                    <NextLink
                      href={`/assets/${a.symbol.toLocaleLowerCase()}`}
                      passHref
                    >
                      <Link
                        fontWeight="bold"
                        color="gray.400"
                        _focus={{ outline: "none" }}
                      >
                        <Icon as={ArrowForwardIcon} display="inline" />
                      </Link>
                    </NextLink>
                  </HStack>
                ))}
            </VStack>
          </Box>
          <Box w="50%">
            <Heading as="h3" fontSize="3xl" mb={6}>
              Cryptocurrencies
            </Heading>
            <VStack spacing={6} align="start" fontSize="2xl">
              {assets
                .filter((a: any) => a.category === "crypto")
                .sort((a: any, b: any) => b.change - a.change)
                .map((a: any) => (
                  <HStack key={a.symbol.toUpperCase()} spacing={4} w="full">
                    <Badge fontSize="xl" p={2} fontFamily="JetBrains Mono">
                      {a.symbol.toLocaleUpperCase()}
                    </Badge>
                    <Text fontSize="lg">{a.name}</Text>
                    <Box flex={1} />
                    <Text fontFamily="JetBrains Mono">
                      ${currency(a.quoteBalance)}
                    </Text>
                    <Text
                      fontFamily="JetBrains Mono"
                      color={a.change > 0 ? "green.500" : "red.500"}
                    >
                      {a.change > 0 ? "+" : "-"}
                      {Math.abs(a.change * 100).toFixed(1)}%
                    </Text>
                    <NextLink
                      href={`/assets/${a.symbol.toLocaleLowerCase()}`}
                      passHref
                    >
                      <Link
                        fontWeight="bold"
                        color="gray.400"
                        _focus={{ outline: "none" }}
                      >
                        <Icon as={ArrowForwardIcon} display="inline" />
                      </Link>
                    </NextLink>
                  </HStack>
                ))}
            </VStack>
          </Box>
        </HStack>
      </Container>
    </Box>
  ) : (
    <Box></Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session?.user?.name == null) {
    return { props: { assets: [], portfolio: [] } };
  }
  try {
    const assets = (
      await axios.get(`${process.env.API_URL}/${session.user.email}/assets`)
    ).data;
    const portfolio = (
      await axios.get(`${process.env.API_URL}/${session.user.email}/portfolio`)
    ).data;
    return { props: { assets, portfolio } };
  } catch (e) {
    console.log(e);
    return { props: { assets: [], portfolio: [] } };
  }
};

export default OverviewPage;
