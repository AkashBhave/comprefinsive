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
import { useState, useEffect } from "react";

import AreaChart from "@/components/area-chart";
import PieChart from "@/components/pie-chart";
import {
  ArrowForwardIcon,
  ArrowLeftIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";

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
  const [displayValue, setDisplayValue] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    setDisplayValue(portfolio[portfolio.length - 1][1]);
    setDisplayPercent(
      (100 * portfolio[portfolio.length - 1][1]) / portfolio[0][1] - 100
    );
  }, []);

  function updateDisplayValue(value: number) {
    if (value < 0) {
      setDisplayValue(portfolio[portfolio.length - 1][1]);
      setDisplayPercent(
        (100 * portfolio[portfolio.length - 1][1]) / portfolio[0][1] - 100
      );
    } else {
      setDisplayValue(value);
      setDisplayPercent((100 * value) / portfolio[0][1] - 100);
      console.log((100 * value) / portfolio[0][1]);
    }
  }

  return session != null ? (
    <Box as="main">
      <Container as="section" textAlign="center">
        <Text fontSize="6xl" fontWeight="bold" fontFamily="JetBrains Mono">
          ${currency(displayValue)}
        </Text>
        <Text
          fontSize="4xl"
          color={displayPercent > 0 ? "green.500" : "red.500"}
          fontFamily="JetBrains Mono"
        >
          <Icon
            as={displayPercent > 0 ? TriangleUpIcon : TriangleDownIcon}
            mr={2}
            fontSize="xl"
          />
          {Math.abs(displayPercent).toFixed(2)}%
        </Text>
      </Container>
      <HStack p={8} spacing={10} divider={<StackDivider />} justify="center">
        <Box as="section" mb={12}>
          <AreaChart
            width={1000}
            height={400}
            data={portfolio}
            sendHoverValue={updateDisplayValue}
          />
        </Box>
        <Box as="section">
          {/* <Heading as="h2" fontSize="4xl" mb={8}>
            Breakdown
          </Heading> */}
          <PieChart width={500} height={400} />
        </Box>
      </HStack>
      <Divider maxW={1000} mx="auto" my={6} px={8} />
      <Container maxW={1200} as="section" textAlign="center" pb={8}>
        {/* <Heading as="h2" fontSize="4xl" mb={6}>
          Assets
        </Heading> */}
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
                    <Badge
                      fontSize="md"
                      p={2}
                      fontFamily="JetBrains Mono"
                      style={{
                        width: "10%",
                        backgroundColor: "#262943",
                        color: "#ebebed",
                        borderRadius: "5px",
                      }}
                    >
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
                      minW={20}
                    >
                      <Icon
                        as={a.change > 0 ? TriangleUpIcon : TriangleDownIcon}
                        mr={1}
                        fontSize="md"
                      />
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
                    <Badge
                      fontSize="md"
                      p={2}
                      fontFamily="JetBrains Mono"
                      style={{
                        width: "10%",
                        backgroundColor: "#262943",
                        color: "#ebebed",
                        borderRadius: "5px",
                      }}
                    >
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
                      <Icon
                        as={a.change > 0 ? TriangleUpIcon : TriangleDownIcon}
                        mr={1}
                        fontSize="md"
                      />
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
