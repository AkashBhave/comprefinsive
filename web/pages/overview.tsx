import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
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

import AreaChart from "@/components/area-chart";
import PieChart from "@/components/pie-chart";
import { ArrowForwardIcon, ArrowLeftIcon } from "@chakra-ui/icons";

const assets = [
  {
    symbol: "AAPL",
    name: "Apple",
    category: "equity",
    amount: 1002.21,
    change: -0.12,
  },
  {
    symbol: "MSFT",
    name: "Microsoft  ",
    category: "equity",
    amount: 5755.21,
    change: 0.07,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    category: "crypto",
    amount: 811.3,
    change: 0.02,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    category: "crypto",
    amount: 1211.3,
    change: -0.22,
  },
];

const OverviewPage: NextPage = () => {
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
          $1000.12
        </Text>
        <Text fontSize="4xl" color="green.500" fontFamily="JetBrains Mono">
          +10.1%
        </Text>
      </Container>
      <Divider maxW={1000} mx="auto" my={6} px={8} />
      <HStack p={8} spacing={10} divider={<StackDivider />} justify="center">
        <Box as="section" mb={12}>
          <Heading as="h2" fontSize="4xl" mb={8}>
            Performance
          </Heading>
          <AreaChart width={1000} height={400} />
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
                .filter((a) => a.category === "equity")
                .sort((a, b) => b.change - a.change)
                .map((a) => (
                  <HStack key={a.symbol.toUpperCase()} spacing={4} w="full">
                    <Badge fontSize="xl" p={2} fontFamily="JetBrains Mono">
                      {a.symbol.toLocaleUpperCase()}
                    </Badge>
                    <Text>{a.name}</Text>
                    <Box flex={1} />
                    <Text fontFamily="JetBrains Mono">
                      ${a.amount.toFixed(2)}
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
                .filter((a) => a.category === "crypto")
                .sort((a, b) => b.change - a.change)
                .map((a) => (
                  <HStack key={a.symbol.toUpperCase()} spacing={4} w="full">
                    <Badge fontSize="xl" p={2} fontFamily="JetBrains Mono">
                      {a.symbol.toLocaleUpperCase()}
                    </Badge>
                    <Text>{a.name}</Text>
                    <Box flex={1} />
                    <Text fontFamily="JetBrains Mono">
                      ${a.amount.toFixed(2)}
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

export default OverviewPage;
