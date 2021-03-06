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
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

import AreaChart from "@/components/area-chart";
import PieChart from "@/components/pie-chart";
import {
  ArrowForwardIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";

const currency = (n: number) =>
  n
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const OverviewPage: NextPage<{ portfolio: any }> = ({ portfolio }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [displayValue, setDisplayValue] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [timeframe, setTimeframe] = useState(portfolio.length);
  const [assets, setAssets] = useState<any>();

  useEffect(() => {
    if (assets != null) return;
    const localAssets = localStorage.getItem("assets");
    if (localAssets != null) {
      setAssets(JSON.parse(localAssets));
    } else {
      if (session?.user?.email == null) return;
      axios
        .get(`${process.env.API_URL}/${session?.user?.email}/assets`)
        .then((res) => {
          setAssets(res.data);
          localStorage.setItem("assets", JSON.stringify(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, [session]);

  useEffect(() => {
    if (assets == null || session?.user == null) return;
    const slicedPortfolio = portfolio.slice(-1 * timeframe);
    setDisplayValue(slicedPortfolio[slicedPortfolio.length - 1][1]);
    setDisplayPercent(
      (100 * slicedPortfolio[slicedPortfolio.length - 1][1]) /
        slicedPortfolio[0][1] -
        100
    );
  }, [timeframe]);

  function updateDisplayValue(value: number) {
    if (assets == null || session?.user == null) return;
    const slicedPortfolio = portfolio.slice(-1 * timeframe);
    if (value < 0) {
      setDisplayValue(slicedPortfolio[slicedPortfolio.length - 1][1]);
      setDisplayPercent(
        (100 * slicedPortfolio[slicedPortfolio.length - 1][1]) /
          slicedPortfolio[0][1] -
          100
      );
    } else {
      setDisplayValue(value);
      setDisplayPercent((100 * value) / slicedPortfolio[0][1] - 100);
    }
  }

  return session != null && assets != null ? (
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
      <HStack
        p={8}
        spacing={10}
        divider={<StackDivider borderColor="#3E4158" />}
        pb={0}
        justify="center"
      >
        <Box as="section" mb={0}>
          <HStack w="full" fontSize="xl" fontWeight="bold" mb={3} spacing={4}>
            {[
              ["1W", 7],
              ["1M", 30],
              ["1Y", portfolio.length],
            ].map((t) => (
              <Text
                key={t[0]}
                cursor="pointer"
                onClick={() => setTimeframe(t[1])}
              >
                {t[0]}
              </Text>
            ))}
          </HStack>
          <AreaChart
            key={timeframe}
            width={800}
            height={400}
            data={portfolio.slice(-1 * timeframe)}
            sendHoverValue={updateDisplayValue}
          />
        </Box>
        <Box as="section">
          <PieChart width={400} height={400} assets={assets} />
        </Box>
      </HStack>
      <Divider maxW={1000} mx="auto" my={6} px={8} borderColor="#3E4158" />
      <Container maxW={1200} as="section" textAlign="center" pb={8}>
        <HStack
          w="full"
          align="start"
          justify="center"
          spacing={10}
          divider={<StackDivider borderColor="#3E4158" />}
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
    return { props: { portfolio: [] } };
  }
  try {
    const portfolio = (
      await axios.get(`${process.env.API_URL}/${session.user.email}/portfolio`)
    ).data;
    return { props: { portfolio } };
  } catch (e) {
    return { props: { portfolio: [] } };
  }
};

export default OverviewPage;
